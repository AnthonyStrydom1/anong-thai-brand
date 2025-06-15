
import { supabase } from "@/integrations/supabase/client";

export class OrderDeletionService {
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
}

export const orderDeletionService = new OrderDeletionService();
