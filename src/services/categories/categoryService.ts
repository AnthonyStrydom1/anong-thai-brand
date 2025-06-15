
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseCategory } from "../types/supabaseTypes";

class CategoryService {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw error;
    return data as SupabaseCategory[];
  }

  async createCategory(category: Omit<SupabaseCategory, 'id'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data as SupabaseCategory;
  }
}

export const categoryService = new CategoryService();
