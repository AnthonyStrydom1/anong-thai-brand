
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseCustomer } from "../types/supabaseTypes";

class CustomerService {
  async createCustomer(customer: Omit<SupabaseCustomer, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .single();
    
    if (error) throw error;
    return data as SupabaseCustomer;
  }

  async getCustomer(id: number) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as SupabaseCustomer;
  }

  async getCurrentUserCustomer() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) throw error;
    return data as SupabaseCustomer | null;
  }

  async getCustomerByUserId(userId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data as SupabaseCustomer | null;
  }

  async updateCustomer(id: number, updates: Partial<Omit<SupabaseCustomer, 'id' | 'created_at'>>) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupabaseCustomer;
  }
}

export const customerService = new CustomerService();
