
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
        const data = await supabaseService.getProduct(id);
        setProduct(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
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

    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, isLoading, error };
};
