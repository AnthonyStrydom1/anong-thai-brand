import React, { useState, useEffect } from 'react';
import { supabaseService } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import OrderManagerHeader from './orders/OrderManagerHeader';
import OrderManagerStats from './orders/OrderManagerStats';
import OrderFilters from './orders/OrderFilters';
import OrderActions from './orders/OrderActions';
import OrderStatusCard from './orders/OrderStatusCard';
import OrderDetailsDialog from './orders/OrderDetailsDialog';
import OrdersEmptyState from './orders/OrdersEmptyState';

// Extended order type to include new fields
interface ExtendedOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  vat_amount?: number | null;
  customer_id: number;
  created_at: string;
  tracking_number?: string | null;
  shipping_method?: string | null;
  courier_service?: string | null;
  estimated_delivery_days?: number | null;
  subtotal?: number;
  shipping_amount?: number;
  currency?: string;
}

const OrderManager = () => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ExtendedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { logAdminAction } = useAdminSecurity();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, paymentFilter, searchTerm]);

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

  const applyFilters = () => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(term) ||
        order.customer_id.toString().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPaymentFilter('all');
    setSearchTerm('');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      for (const orderId of selectedOrders) {
        await updateOrderStatus(orderId, newStatus);
      }
      setSelectedOrders([]);
      toast({
        title: "Success",
        description: `Updated ${selectedOrders.length} orders to ${newStatus}`,
      });
    } catch (error) {
      console.error('Bulk update failed:', error);
      toast({
        title: "Error",
        description: "Failed to update some orders",
        variant: "destructive"
      });
    }
  };

  const handleExportOrders = () => {
    const csvContent = [
      ['Order Number', 'Status', 'Payment Status', 'Total Amount', 'Created Date'].join(','),
      ...filteredOrders.map(order => [
        order.order_number,
        order.status,
        order.payment_status,
        order.total_amount,
        new Date(order.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

      // Log the security event
      await logAdminAction('update', 'order_status', orderId, {
        order_number: order?.order_number,
        old_status: oldStatus,
        new_status: newStatus,
        customer_id: order?.customer_id,
        total_amount: order?.total_amount
      });

      // Update the local state
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

      // Log the security event
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

      // Log the security event
      await logAdminAction('update', 'order_tracking', orderId, {
        order_number: order?.order_number,
        tracking_number: trackingNumber,
        customer_id: order?.customer_id
      });

      // Update the local state
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

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <OrderManagerHeader onRefresh={loadOrders} />
      
      <OrderManagerStats orders={orders} />

      <OrderFilters
        statusFilter={statusFilter}
        paymentFilter={paymentFilter}
        searchTerm={searchTerm}
        onStatusFilterChange={setStatusFilter}
        onPaymentFilterChange={setPaymentFilter}
        onSearchChange={setSearchTerm}
        onClearFilters={clearFilters}
      />

      <OrderActions
        selectedOrders={selectedOrders}
        onSelectAll={handleSelectAll}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onExportOrders={handleExportOrders}
        totalOrders={filteredOrders.length}
      />

      {filteredOrders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <OrderStatusCard
              key={order.id}
              order={order}
              onStatusUpdate={updateOrderStatus}
              onPaymentStatusUpdate={updatePaymentStatus}
              onTrackingUpdate={updateTrackingNumber}
              onViewDetails={viewOrderDetails}
            />
          ))}
        </div>
      )}

      <OrderDetailsDialog
        isOpen={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

export default OrderManager;
