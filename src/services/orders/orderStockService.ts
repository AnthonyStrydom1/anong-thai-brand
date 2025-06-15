
import { supabase } from "@/integrations/supabase/client";

export class OrderStockService {
  async restoreStockForCancelledOrder(orderId: string) {
    try {
      // Get all order items for this order
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('product_id, quantity')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Restore stock for each product in the order
      for (const item of orderItems) {
        // Update product stock manually since we don't have the RPC function yet
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single();

        if (productError) {
          console.error('Error fetching product:', item.product_id, productError);
          continue;
        }

        const { error: stockError } = await supabase
          .from('products')
          .update({ stock_quantity: product.stock_quantity + item.quantity })
          .eq('id', item.product_id);

        if (stockError) {
          console.error('Error restoring stock for product:', item.product_id, stockError);
          // Continue with other items even if one fails
        }

        // Create inventory movement record
        await this.createInventoryMovement({
          product_id: item.product_id,
          movement_type: 'in',
          quantity: item.quantity,
          reference_type: 'return',
          reference_id: orderId,
          notes: 'Stock restored due to order cancellation'
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error restoring stock for cancelled order:', error);
      throw error;
    }
  }

  private async createInventoryMovement(movement: {
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
}

export const orderStockService = new OrderStockService();
