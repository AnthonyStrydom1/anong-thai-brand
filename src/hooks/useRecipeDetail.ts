
import { useState, useEffect, useMemo } from "react";
import { recipes } from "@/data/recipes";
import { products } from "@/data/products";

export const useRecipeDetail = (id: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced recipe lookup with multiple fallback strategies
  const recipe = useMemo(() => {
    if (!id) return null;
    
    console.log('Looking for recipe with ID:', id);
    console.log('Available recipes:', recipes.map(r => ({ id: r.id, name: r.name })));
    
    // Strategy 1: Direct exact match
    let foundRecipe = recipes.find(r => r.id === id);
    if (foundRecipe) {
      console.log('Found recipe via exact match:', foundRecipe.id);
      return foundRecipe;
    }
    
    // Strategy 2: Case-insensitive match
    foundRecipe = recipes.find(r => r.id.toLowerCase() === id.toLowerCase());
    if (foundRecipe) {
      console.log('Found recipe via case-insensitive match:', foundRecipe.id);
      return foundRecipe;
    }
    
    // Strategy 3: URL decoded match
    try {
      const decodedId = decodeURIComponent(id);
      foundRecipe = recipes.find(r => r.id === decodedId || r.id.toLowerCase() === decodedId.toLowerCase());
      if (foundRecipe) {
        console.log('Found recipe via URL decoded match:', foundRecipe.id);
        return foundRecipe;
      }
    } catch (e) {
      console.log('Failed to decode URL:', e);
    }
    
    // Strategy 4: Partial match (for hyphenated variations)
    const normalizedId = id.toLowerCase().replace(/[-_\s]/g, '');
    foundRecipe = recipes.find(r => {
      const normalizedRecipeId = r.id.toLowerCase().replace(/[-_\s]/g, '');
      return normalizedRecipeId === normalizedId;
    });
    if (foundRecipe) {
      console.log('Found recipe via normalized match:', foundRecipe.id);
      return foundRecipe;
    }
    
    // Strategy 5: Search by name match (last resort)
    foundRecipe = recipes.find(r => 
      r.name.en.toLowerCase().replace(/[-_\s]/g, '') === normalizedId ||
      r.name.th.toLowerCase().replace(/[-_\s]/g, '') === normalizedId
    );
    if (foundRecipe) {
      console.log('Found recipe via name match:', foundRecipe.id);
      return foundRecipe;
    }
    
    console.log('No recipe found for ID:', id);
    return null;
  }, [id]);
  
  useEffect(() => {
    // Scroll to top when component mounts or recipe changes
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setIsLoading(false);
  }, [id]);
  
  const relatedProducts = useMemo(() => {
    if (!recipe) return [];
    
    console.log('Recipe related products:', recipe.relatedProducts);
    const matchedProducts = products.filter(product => 
      recipe.relatedProducts.includes(product.id)
    );
    console.log('Matched products:', matchedProducts.map(p => p.id));
    return matchedProducts;
  }, [recipe]);

  return {
    recipe,
    relatedProducts,
    isLoading
  };
};
