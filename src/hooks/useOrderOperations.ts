
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import { ExtendedOrder } from './useOrderManager';

export const useOrderOperations = (
  setOrders: (orders: ExtendedOrder[]) => void,
  setIsLoading: (loading: boolean) => void,
  setSelectedOrder: (order: any) => void,
  setIsOrderDialogOpen: (open: boolean) => void
) => {
  const { logAdminAction } = useAdminSecurity();

  const loadOrders = async () => {
    try {
      console.log('Loading orders...');
      await logAdminAction('view', 'orders_list', undefined, { action: 'load_orders_for_management' });
      
      const { data, error } = await supabaseService.supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders error:', error);
        await logAdminAction('view', 'orders_list', undefined, { error: error.message }, false);
        throw error;
      }

      console.log('Loaded orders:', data);
      setOrders(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const viewOrderDetails = async (orderId: string) => {
    try {
      console.log('Loading order details for:', orderId);
      
      await logAdminAction('view', 'order_details', orderId, { action: 'view_order_details' });
      
      const { data, error } = await supabaseService.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, sku, price)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Order details error:', error);
        await logAdminAction('view', 'order_details', orderId, { error: error.message }, false);
        throw error;
      }

      console.log('Order details loaded:', data);
      setSelectedOrder(data);
      setIsOrderDialogOpen(true);
    } catch (error) {
      console.error('Failed to load order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive"
      });
    }
  };

  return {
    loadOrders,
    viewOrderDetails,
  };
};
