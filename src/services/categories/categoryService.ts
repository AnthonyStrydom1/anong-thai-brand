
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SupabaseCategory = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export class CategoryService {
  async getCategories(): Promise<SupabaseCategory[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createCategories(categories: CategoryInsert[]): Promise<SupabaseCategory[]> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (error) throw error;
    return data || [];
  }

  async getCategoryById(id: string): Promise<SupabaseCategory | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateCategory(id: string, updates: Partial<CategoryInsert>): Promise<SupabaseCategory> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const categoryService = new CategoryService();
