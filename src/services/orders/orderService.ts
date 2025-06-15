
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { SupabaseOrder } from "../types/supabaseTypes";

type DbOrderItem = Database['public']['Tables']['order_items']['Row'];

class OrderService {
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

  async updateOrderStatus(orderId: string, status: string) {
    try {
      // If cancelling an order, restore stock first
      if (status === 'cancelled') {
        // Get current order status to check if it was previously active
        const { data: currentOrder, error: fetchError } = await supabase
          .from('orders')
          .select('status')
          .eq('id', orderId)
          .single();

        if (fetchError) throw fetchError;

        // Only restore stock if the order was not already cancelled
        if (currentOrder.status !== 'cancelled') {
          await this.restoreStockForCancelledOrder(orderId);
        }
      }

      // Update the order status
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
      
      if (error) throw error;
      return data as SupabaseOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data as SupabaseOrder;
  }

  async getCustomerOrdersByUserId(userId: string) {
    const { data, error } = await supabase
      .rpc('get_customer_orders', { user_uuid: userId });
    
    if (error) throw error;
    return data;
  }

  async deleteOrder(orderId: string) {
    try {
      const { data, error } = await supabase.rpc('delete_order', {
        order_id_param: orderId
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

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

export const orderService = new OrderService();
