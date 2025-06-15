
import { useState } from 'react';
import { orderService } from '@/services/orders/orderService';
import { toast } from '@/hooks/use-toast';
import { useAdminSecurity } from '@/hooks/useAdminSecurity';
import { ExtendedOrder } from './useOrderManager';

export const useOrderActions = (
  orders: ExtendedOrder[],
  setOrders: (orders: ExtendedOrder[]) => void,
  selectedOrder: any,
  setSelectedOrder: (order: any) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { logAdminAction } = useAdminSecurity();

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      console.log('Updating order status:', orderId, status);
      
      await logAdminAction('update', 'order_status', orderId, {
        order_number: order?.order_number,
        old_status: order?.status,
        new_status: status
      });

      await orderService.updateOrderStatus(orderId, status);

      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status } : o
      ));

      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      await logAdminAction('update', 'order_status', orderId, {
        error: error.message,
        attempted_status: status
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      console.log('Updating payment status:', orderId, paymentStatus);
      
      await logAdminAction('update', 'order_payment_status', orderId, {
        order_number: order?.order_number,
        old_payment_status: order?.payment_status,
        new_payment_status: paymentStatus
      });

      await orderService.updatePaymentStatus(orderId, paymentStatus);

      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, payment_status: paymentStatus } : o
      ));

      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
      }

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
      await logAdminAction('update', 'order_payment_status', orderId, {
        error: error.message,
        attempted_payment_status: paymentStatus
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    }
  };

  const updateTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      console.log('Updating tracking number:', orderId, trackingNumber);
      
      await logAdminAction('update', 'order_tracking', orderId, {
        order_number: order?.order_number,
        tracking_number: trackingNumber
      });

      await orderService.updateTrackingNumber(orderId, trackingNumber);

      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, tracking_number: trackingNumber } : o
      ));

      // Update selected order if it's the one being updated
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, tracking_number: trackingNumber });
      }

      toast({
        title: "Success",
        description: "Tracking number updated successfully",
      });
    } catch (error) {
      console.error('Failed to update tracking number:', error);
      await logAdminAction('update', 'order_tracking', orderId, {
        error: error.message,
        attempted_tracking_number: trackingNumber
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to update tracking number",
        variant: "destructive"
      });
    }
  };

  const confirmDeleteOrder = async (order: ExtendedOrder) => {
    try {
      setIsDeleting(true);
      console.log('Deleting order:', order.id);
      
      await logAdminAction('delete', 'order', order.id, {
        order_number: order.order_number,
        customer_id: order.customer_id,
        total_amount: order.total_amount
      });

      await orderService.deleteOrder(order.id);

      // Remove from local state
      setOrders(orders.filter(o => o.id !== order.id));

      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete order:', error);
      await logAdminAction('delete', 'order', order.id, {
        error: error.message,
        order_number: order.order_number
      }, false);
      
      toast({
        title: "Error",
        description: "Failed to delete order",
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
