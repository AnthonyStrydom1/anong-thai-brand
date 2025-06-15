
import { useState, useEffect } from 'react';
import { supabaseService, type SupabaseProduct } from '@/services/supabaseService';

export const useSupabaseProducts = (categoryId?: string) => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await supabaseService.getProducts();
      // Filter by category if provided
      const filteredData = categoryId ? data.filter(p => p.category_id === categoryId) : data;
      setProducts(filteredData);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProduct = async (id: string): Promise<SupabaseProduct | null> => {
    try {
      return await supabaseService.getProduct(id);
    } catch (err) {
      console.error('Error loading product:', err);
      throw err;
    }
  };

  const createProduct = async (product: Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newProduct = await supabaseService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error creating product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedProduct = await supabaseService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await supabaseService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  return {
    products,
    isLoading,
    error,
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

// Export single product hook
export const useSupabaseProduct = (id: string) => {
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await supabaseService.getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  return {
    product,
    isLoading,
    error,
  };
};
