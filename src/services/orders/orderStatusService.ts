
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseOrder } from "../types/supabaseTypes";
import { orderStockService } from "./orderStockService";

export class OrderStatusService {
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
          await orderStockService.restoreStockForCancelledOrder(orderId);
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
}

export const orderStatusService = new OrderStatusService();
