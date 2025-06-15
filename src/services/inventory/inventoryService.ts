
import { supabase } from "@/integrations/supabase/client";

class InventoryService {
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
}

export const inventoryService = new InventoryService();
