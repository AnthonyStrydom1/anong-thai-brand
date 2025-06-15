
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from 'lucide-react';
import OrderActionButtons from './OrderActionButtons';
import { ExtendedOrder } from '@/hooks/useOrderManager';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format } from 'date-fns';

interface OrderTableProps {
  filteredOrders: ExtendedOrder[];
  onStatusUpdate: (orderId: string, status: string) => void;
  onPaymentStatusUpdate: (orderId: string, paymentStatus: string) => void;
  onViewDetails: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onEditOrder?: (orderId: string) => void;
}

const OrderTable = ({
  filteredOrders,
  onStatusUpdate,
  onPaymentStatusUpdate,
  onViewDetails,
  onDeleteOrder,
  onEditOrder = () => {}
}: OrderTableProps) => {
  const { formatPrice } = useCurrency();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const handleMarkShipped = (orderId: string) => {
    onStatusUpdate(orderId, 'shipped');
  };

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No orders found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-32">Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Tracking</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {order.order_number}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  Customer #{order.customer_id}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-600">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                  <div className="text-xs text-gray-400">
                    {format(new Date(order.created_at), 'HH:mm')}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPaymentBadgeVariant(order.payment_status)}>
                  {order.payment_status}
                </Badge>
              </TableCell>
              <TableCell>
                {order.tracking_number ? (
                  <div className="text-sm">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {order.tracking_number}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">No tracking</span>
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatPrice(order.total_amount)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(order.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditOrder(order.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <OrderActionButtons
                    orderId={order.id}
                    onViewDetails={onViewDetails}
                    onEditOrder={onEditOrder}
                    onDeleteOrder={onDeleteOrder}
                    onMarkShipped={handleMarkShipped}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
