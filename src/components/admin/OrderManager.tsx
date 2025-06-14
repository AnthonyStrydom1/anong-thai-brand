
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Eye, Package2, Truck, CheckCircle } from "lucide-react";
import { supabaseService, SupabaseOrder } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";
import { useAdminSecurity } from "@/hooks/useAdminSecurity";
import { useCurrency } from "@/contexts/CurrencyContext";

const OrderManager = () => {
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const { logAdminAction } = useAdminSecurity();
  const { formatPrice, selectedCurrency } = useCurrency();

  useEffect(() => {
    loadOrders();
  }, []);

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

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'processing':
        return <Package2 className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Order Manager</h1>
          <p className="text-gray-600 text-sm mt-1">
            All amounts displayed in {selectedCurrency.name} ({selectedCurrency.symbol})
          </p>
        </div>
        <Button onClick={loadOrders} variant="outline">
          Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 text-center">
              Orders will appear here once customers start making purchases.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex justify-between items-center p-6">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold">Order #{order.order_number}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer ID: {order.customer_id}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                    <div className="flex space-x-2 mt-1">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Select onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select onValueChange={(value) => updatePaymentStatus(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => viewOrderDetails(order.id)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details - #{selectedOrder?.order_number}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-semibold">Status:</p>
                              <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                                {selectedOrder.status}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-semibold">Payment Status:</p>
                              <Badge variant={getStatusBadgeVariant(selectedOrder.payment_status)}>
                                {selectedOrder.payment_status}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-semibold">Total Amount:</p>
                              <p>{formatPrice(selectedOrder.total_amount)}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Created:</p>
                              <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          
                          {selectedOrder.order_items && (
                            <div>
                              <h4 className="font-semibold mb-2">Order Items:</h4>
                              <div className="space-y-2">
                                {selectedOrder.order_items.map((item: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center p-2 border rounded">
                                    <div>
                                      <p className="font-medium">{item.product_name}</p>
                                      <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                                    </div>
                                    <div className="text-right">
                                      <p>Qty: {item.quantity}</p>
                                      <p>{formatPrice(item.total_price)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManager;
