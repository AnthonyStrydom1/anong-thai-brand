
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Eye, Package2, Truck, CheckCircle } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

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
}

interface OrderStatusCardProps {
  order: ExtendedOrder;
  onStatusUpdate: (orderId: string, status: string) => void;
  onPaymentStatusUpdate: (orderId: string, paymentStatus: string) => void;
  onTrackingUpdate: (orderId: string, trackingNumber: string) => void;
  onViewDetails: (orderId: string) => void;
}

const OrderStatusCard = ({ 
  order, 
  onStatusUpdate, 
  onPaymentStatusUpdate, 
  onTrackingUpdate, 
  onViewDetails 
}: OrderStatusCardProps) => {
  const { formatPrice } = useCurrency();

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

  return (
    <Card>
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
            {order.tracking_number && (
              <p className="text-sm text-blue-600">
                Tracking: {order.tracking_number}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold">{formatPrice(order.total_amount)}</p>
            <p className="text-xs text-gray-500">
              VAT: {formatPrice(order.vat_amount || 0)}
            </p>
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
            <Select onValueChange={(value) => onStatusUpdate(order.id, value)}>
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
            
            <Select onValueChange={(value) => onPaymentStatusUpdate(order.id, value)}>
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

            <div className="flex space-x-1">
              <Input
                placeholder="Tracking #"
                className="w-24 h-8 text-xs"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onTrackingUpdate(order.id, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(order.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusCard;
