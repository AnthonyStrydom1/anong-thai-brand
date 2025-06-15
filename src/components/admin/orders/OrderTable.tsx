
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { ExtendedOrder } from '@/hooks/useOrderManager';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format } from 'date-fns';

interface OrderTableProps {
  filteredOrders: ExtendedOrder[];
  onStatusUpdate: (orderId: string, status: string) => void;
  onPaymentStatusUpdate: (orderId: string, paymentStatus: string) => void;
  onViewDetails: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

const OrderTable = ({
  filteredOrders,
  onStatusUpdate,
  onPaymentStatusUpdate,
  onViewDetails,
  onDeleteOrder
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
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-20">Actions</TableHead>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge 
                      variant={getStatusBadgeVariant(order.status)} 
                      className="cursor-pointer hover:opacity-80"
                    >
                      {order.status}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'pending')}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'processing')}>
                      Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'shipped')}>
                      Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'delivered')}>
                      Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(order.id, 'cancelled')}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge 
                      variant={getPaymentBadgeVariant(order.payment_status)} 
                      className="cursor-pointer hover:opacity-80"
                    >
                      {order.payment_status}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onPaymentStatusUpdate(order.id, 'pending')}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPaymentStatusUpdate(order.id, 'paid')}>
                      Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPaymentStatusUpdate(order.id, 'failed')}>
                      Failed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPaymentStatusUpdate(order.id, 'refunded')}>
                      Refunded
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatPrice(order.total_amount)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(order.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteOrder(order.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;
