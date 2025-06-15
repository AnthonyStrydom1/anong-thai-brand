
import { supabase } from "@/integrations/supabase/client";
import { transformDbProduct } from "../utils/supabaseHelpers";
import type { SupabaseProduct } from "../types/supabaseTypes";

class ProductService {
  async getProducts(categoryId?: string) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data.map(transformDbProduct);
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return transformDbProduct(data);
  }

  async createProduct(product: Omit<SupabaseProduct, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return transformDbProduct(data);
  }

  async updateProductStock(productId: string, quantity: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return transformDbProduct(data);
  }

  async searchProducts(searchTerm: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`);
    
    if (error) throw error;
    return data.map(transformDbProduct);
  }
}

export const productService = new ProductService();
