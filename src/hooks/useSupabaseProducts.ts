
import { useState, useEffect } from 'react';
import { supabaseService, SupabaseProduct } from '@/services/supabaseService';
import { toast } from '@/components/ui/use-toast';

export const useSupabaseProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await supabaseService.getProducts(categoryId);
        setProducts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [categoryId]);

  return { products, isLoading, error, refetch: () => setIsLoading(true) };
};

export const useSupabaseProduct = (id: string) => {
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Handle both UUID and recipe product ID formats
        let productData = null;
        
        // First try to get by UUID (direct Supabase ID)
        if (id.length > 20) {
          productData = await supabaseService.getProduct(id);
        } else {
          // Map recipe product IDs to product names
          const recipeProductMap: { [key: string]: string } = {
            'pad-thai-sauce': 'Pad Thai Sauce',
            'sukiyaki-sauce': 'Sukiyaki Dipping Sauce',
            'tom-yum-paste': 'Tom Yum Chili Paste',
            'red-curry-paste': 'Red Curry Paste',
            'panang-curry-paste': 'Panang Curry Paste',
            'massaman-curry-paste': 'Massaman Curry Paste',
            'green-curry-paste': 'Green Curry Paste',
            'yellow-curry-paste': 'Yellow Curry Paste'
          };
          
          const productName = recipeProductMap[id];
          if (productName) {
            // Get all products and find by name
            const allProducts = await supabaseService.getProducts();
            productData = allProducts.find(p => p.name === productName) || null;
          }
        }
        
        setProduct(productData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
        setError(errorMessage);
        console.error('Product loading error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, isLoading, error };
};
