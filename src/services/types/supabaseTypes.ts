
import type { Database } from "@/integrations/supabase/types";

export type SupabaseOrder = Database['public']['Tables']['orders']['Row'];
export type SupabaseProduct = Database['public']['Tables']['products']['Row'];
export type SupabaseCustomer = Database['public']['Tables']['customers']['Row'];
export type SupabaseOrderItem = Database['public']['Tables']['order_items']['Row'];
export type SupabaseCategory = Database['public']['Tables']['categories']['Row'];
