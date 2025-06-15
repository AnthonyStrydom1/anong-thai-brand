
import { useState } from 'react';
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import { ExtendedOrder } from './useOrderManager';

export const useOrderActions = (
  orders: ExtendedOrder[],
  setOrders: (orders: ExtendedOrder[]) => void,
  selectedOrder: any,
  setSelectedOrder: (order: any) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { logAdminAction } = useAdminSecurity();

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    const oldStatus = order?.status;
    
    try {
      console.log('Updating order status:', orderId, newStatus);
      
      const { data, error } = await supabaseService.supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      console.log('Update successful:', data);

      await logAdminAction('update', 'order_status', orderId, {
        order_number: order?.order_number,
        old_status: oldStatus,
        new_status: newStatus,
        customer_id: order?.customer_id,
        total_amount: order?.total_amount
      });

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      await logAdminAction('update', 'order_status', orderId, {
        error: error.message,
        attempted_status: newStatus,
        order_number: order?.order_number
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    const oldPaymentStatus = order?.payment_status;
    
    try {
      console.log('Updating payment status:', orderId, newPaymentStatus);
      
      const { data, error } = await supabaseService.supabase
        .from('orders')
        .update({ payment_status: newPaymentStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Payment update error:', error);
        throw error;
      }

      console.log('Payment update successful:', data);

      await logAdminAction('update', 'order_payment_status', orderId, {
        order_number: order?.order_number,
        old_payment_status: oldPaymentStatus,
        new_payment_status: newPaymentStatus,
        customer_id: order?.customer_id,
        total_amount: order?.total_amount
      });

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, payment_status: newPaymentStatus } : order
      ));

      toast({
        title: "Success",
        description: `Payment status updated to ${newPaymentStatus}`,
      });

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: newPaymentStatus });
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
      await logAdminAction('update', 'order_payment_status', orderId, {
        error: error.message,
        attempted_payment_status: newPaymentStatus,
        order_number: order?.order_number
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    const order = orders.find(o => o.id === orderId);
    
    try {
      console.log('Updating tracking number:', orderId, trackingNumber);
      
      const { data, error } = await supabaseService.supabase
        .from('orders')
        .update({ tracking_number: trackingNumber })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Tracking update error:', error);
        throw error;
      }

      console.log('Tracking update successful:', data);

      await logAdminAction('update', 'order_tracking', orderId, {
        order_number: order?.order_number,
        tracking_number: trackingNumber,
        customer_id: order?.customer_id
      });

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, tracking_number: trackingNumber } : order
      ));

      toast({
        title: "Success",
        description: "Tracking number updated successfully",
      });

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, tracking_number: trackingNumber });
      }
    } catch (error) {
      console.error('Failed to update tracking number:', error);
      await logAdminAction('update', 'order_tracking', orderId, {
        error: error.message,
        order_number: order?.order_number
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to update tracking number",
        variant: "destructive"
      });
    }
  };

  const confirmDeleteOrder = async (orderToDelete: ExtendedOrder) => {
    if (!orderToDelete) return;
    
    setIsDeleting(true);
    try {
      console.log('Deleting order:', orderToDelete.id);
      
      await logAdminAction('delete', 'order', orderToDelete.id, {
        order_number: orderToDelete.order_number,
        customer_id: orderToDelete.customer_id,
        total_amount: orderToDelete.total_amount,
        status: orderToDelete.status
      });
      
      await supabaseService.deleteOrder(orderToDelete.id);
      
      // Remove the deleted order from the local state immediately
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      
      toast({
        title: "Success",
        description: `Order #${orderToDelete.order_number} has been deleted successfully`,
      });
      
    } catch (error) {
      console.error('Failed to delete order:', error);
      await logAdminAction('delete', 'order', orderToDelete.id, {
        error: error.message,
        order_number: orderToDelete.order_number
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    updateOrderStatus,
    updatePaymentStatus,
    updateTrackingNumber,
    confirmDeleteOrder,
  };
};
