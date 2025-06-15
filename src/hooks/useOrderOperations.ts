
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import { VATCalculator } from "@/utils/vatCalculator";
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
      
      // Process orders to ensure VAT calculations are consistent
      const processedOrders = data?.map(order => {
        // If vat_amount is missing or incorrect, recalculate from total_amount
        if (!order.vat_amount && order.total_amount) {
          const vatBreakdown = VATCalculator.calculateFromInclusivePrice(order.total_amount);
          return {
            ...order,
            vat_amount: vatBreakdown.vatAmount,
            subtotal: vatBreakdown.priceExcludingVAT
          };
        }
        return order;
      }) || [];

      setOrders(processedOrders);
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
      
      // Ensure VAT calculations are correct for the selected order
      if (!data.vat_amount && data.total_amount) {
        const vatBreakdown = VATCalculator.calculateFromInclusivePrice(data.total_amount);
        data.vat_amount = vatBreakdown.vatAmount;
        data.subtotal = vatBreakdown.priceExcludingVAT;
      }
      
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
