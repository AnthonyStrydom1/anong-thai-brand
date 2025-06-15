
// Shared types for Supabase services
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
  ingredients: {
    en: string[];
    th: string[];
  } | null;
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
  total_orders: number | null;
  total_spent: number | null;
  is_active: boolean | null;
  user_id: string | null;
}

export interface SupabaseOrder {
  id: string;
  order_number: string;
  customer_id: number | null;
  status: string | null;
  payment_status: string | null;
  total_amount: number;
  subtotal: number;
  vat_amount: number | null;
  shipping_amount: number | null;
  created_at: string;
}
