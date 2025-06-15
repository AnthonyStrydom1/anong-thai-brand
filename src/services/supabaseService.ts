
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface SupabaseProduct {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  sku: string;
  price: number;
  compare_price?: number | null;
  cost_price?: number | null;
  stock_quantity: number;
  low_stock_threshold?: number | null;
  manage_stock?: boolean | null;
  allow_backorders?: boolean | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: string | null;
  images: any[];
  ingredients: any;
  weight?: number | null;
  dimensions?: any | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseCustomer {
  id: number;
  user_id: string | null;
  fullname: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  is_active: boolean;
  marketing_consent: boolean;
  total_spent: number;
  total_orders: number;
  last_order_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInventoryMovementParams {
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reference_type?: 'purchase' | 'sale' | 'adjustment' | 'return';
  reference_id?: string;
  notes?: string;
}

class SupabaseService {
  supabase = supabase;

  // Product methods
  async getProducts(): Promise<SupabaseProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async createProduct(product: Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseProduct> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProduct(id: string, updates: Partial<Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'>>): Promise<SupabaseProduct> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async updateProductStock(productId: string, newQuantity: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: newQuantity })
      .eq('id', productId);
    
    if (error) throw error;
  }

  // Customer methods
  async getCurrentUserCustomer(): Promise<SupabaseCustomer | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  async updateCustomer(id: number, updates: Partial<Omit<SupabaseCustomer, 'id' | 'created_at' | 'updated_at'>>): Promise<SupabaseCustomer> {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Inventory methods
  async createInventoryMovement(params: CreateInventoryMovementParams) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .insert([params])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Admin user methods
  async deleteAdminUser(userId: string): Promise<void> {
    // First remove from user_roles
    const { error: rolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (rolesError) throw rolesError;

    // Then remove from users table
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (userError) throw userError;
  }

  async addUserRole(userId: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role }]);

    if (error && error.code !== '23505') throw error; // Ignore duplicate key errors
  }

  async removeUserRole(userId: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    if (error) throw error;
  }
}

export const supabaseService = new SupabaseService();
