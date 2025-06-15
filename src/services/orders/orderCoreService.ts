
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { SupabaseOrder } from "../types/supabaseTypes";

type DbOrderItem = Database['public']['Tables']['order_items']['Row'];

export class OrderCoreService {
  async createOrder(order: Database['public']['Tables']['orders']['Insert']) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupabaseOrder;
  }

  async getOrders(customerId: number) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SupabaseOrder[];
  }

  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SupabaseOrder[];
  }

  async getOrder(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, sku, price)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createOrderItem(orderItem: Omit<DbOrderItem, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('order_items')
      .insert([orderItem])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCustomerOrdersByUserId(userId: string) {
    const { data, error } = await supabase
      .rpc('get_customer_orders', { user_uuid: userId });
    
    if (error) throw error;
    return data;
  }
}

export const orderCoreService = new OrderCoreService();
