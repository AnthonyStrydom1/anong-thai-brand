
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { products } from "@/data/products";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, memo, useMemo } from "react";
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeInstructions from "@/components/recipe/RecipeInstructions";
import RelatedProducts from "@/components/recipe/RelatedProducts";
import IngredientsSection from "@/components/recipe/IngredientsSection";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  // More robust recipe lookup with case-insensitive matching and URL decoding
  const recipe = useMemo(() => {
    if (!id) return null;
    
    // First try exact match
    let foundRecipe = recipes.find(r => r.id === id);
    
    // If no exact match, try case-insensitive match
    if (!foundRecipe) {
      foundRecipe = recipes.find(r => r.id.toLowerCase() === id.toLowerCase());
    }
    
    // If still no match, try with URL decoding
    if (!foundRecipe) {
      const decodedId = decodeURIComponent(id);
      foundRecipe = recipes.find(r => r.id === decodedId || r.id.toLowerCase() === decodedId.toLowerCase());
    }
    
    // Log for debugging
    if (!foundRecipe) {
      console.log('Recipe not found for ID:', id);
      console.log('Available recipe IDs:', recipes.map(r => r.id));
    }
    
    return foundRecipe;
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
  
  const translations = useMemo(() => ({
    en: {
      ingredients: "Ingredients",
      instructions: "Instructions",
      servings: "Servings",
      minutes: "minutes",
      productsUsed: "Products Used in This Recipe",
      viewProduct: "View Product",
      step: "Step",
      backToRecipes: "Back to Recipes"
    },
    th: {
      ingredients: "ส่วนผสม",
      instructions: "วิธีทำ",
      servings: "จำนวนที่เสิร์ฟ",
      minutes: "นาที",
      productsUsed: "ผลิตภัณฑ์ที่ใช้ในสูตรนี้",
      viewProduct: "ดูผลิตภัณฑ์",
      step: "ขั้นตอนที่",
      backToRecipes: "กลับสู่สูตรอาหาร"
    }
  }), []);
  
  const t = translations[language];
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <main className="flex-grow anong-section">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="anong-heading text-2xl mb-4 text-anong-black">
              {language === 'en' ? 'Recipe not found' : 'ไม่พบสูตรอาหาร'}
            </h2>
            <p className="anong-body text-anong-black/70 mb-6">
              {language === 'en' 
                ? `The recipe with ID "${id}" could not be found.` 
                : `ไม่พบสูตรอาหารที่มี ID "${id}"`
              }
            </p>
            <Link to="/recipes" className="anong-btn-primary">
              {language === 'en' ? 'Browse all recipes' : 'ดูสูตรอาหารทั้งหมด'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8 md:py-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/recipes" className="flex items-center text-anong-black hover:text-anong-gold transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="anong-body text-sm">{t.backToRecipes}</span>
            </Link>
          </div>
          
          {/* Recipe Header */}
          <RecipeHeader recipe={recipe} language={language} t={t} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              {/* Recipe Image - Load eagerly since it's the main content */}
              <Card className="anong-card overflow-hidden">
                <div className="h-64 md:h-80 bg-gradient-to-b from-anong-cream to-anong-ivory p-8 flex items-center justify-center">
                  <img
                    src={recipe.image}
                    alt={recipe.name[language]}
                    className="max-w-[320px] max-h-[320px] w-auto h-auto object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </Card>
              
              {/* Instructions */}
              <RecipeInstructions recipe={recipe} language={language} t={t} />
              
              {/* Related Products */}
              <RelatedProducts relatedProducts={relatedProducts} language={language} t={t} />
            </div>
            
            {/* Ingredients Sidebar */}
            <div>
              <IngredientsSection recipe={recipe} language={language} t={t} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default memo(RecipeDetail);
