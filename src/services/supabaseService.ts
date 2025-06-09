
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Database types
type DbProduct = Database['public']['Tables']['products']['Row'];
type DbCategory = Database['public']['Tables']['categories']['Row'];
type DbCustomer = Database['public']['Tables']['customers']['Row'];
type DbOrder = Database['public']['Tables']['orders']['Row'];
type DbOrderItem = Database['public']['Tables']['order_items']['Row'];

export interface SupabaseProduct {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  sku: string;
  price: number;
  category_id: string | null;
  images: any;
  stock_quantity: number;
  is_active: boolean | null;
  is_featured: boolean | null;
  created_at: string;
}

export interface SupabaseCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  is_active: boolean | null;
}

export interface SupabaseCustomer {
  id: number;
  fullname: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string | null;
}

export interface SupabaseOrder {
  id: string;
  order_number: string;
  customer_id: number | null;
  status: string | null;
  payment_status: string | null;
  total_amount: number;
  subtotal: number;
  created_at: string;
}

class SupabaseService {
  // Products
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
    return data as SupabaseProduct[];
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data as SupabaseProduct;
  }

  async createProduct(product: Omit<SupabaseProduct, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data as SupabaseProduct;
  }

  async updateProductStock(productId: string, quantity: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupabaseProduct;
  }

  // Categories
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

  // Customers
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

  // Orders
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

  // Order Items
  async createOrderItem(orderItem: Omit<DbOrderItem, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('order_items')
      .insert([orderItem])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Inventory
  async createInventoryMovement(movement: {
    product_id: string;
    movement_type: 'in' | 'out' | 'adjustment';
    quantity: number;
    reference_type?: 'purchase' | 'sale' | 'adjustment' | 'return';
    reference_id?: string;
    notes?: string;
  }) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .insert([movement])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getInventoryMovements(productId: string) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Search
  async searchProducts(searchTerm: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`);
    
    if (error) throw error;
    return data as SupabaseProduct[];
  }
}

export const supabaseService = new SupabaseService();
