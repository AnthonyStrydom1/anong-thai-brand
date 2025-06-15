
import { useState, useEffect } from 'react';
import { supabaseService, type SupabaseProduct } from '@/services/supabaseService';

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supabaseService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
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
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
