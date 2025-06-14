
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Package, Truck } from "lucide-react";
import { shippingService } from "@/services/shippingService";

interface OrderTrackingProps {
  order: {
    id: string;
    order_number: string;
    status: string;
    tracking_number?: string;
    courier_service?: string;
    estimated_delivery_days?: number;
    created_at: string;
  };
}

const OrderTracking = ({ order }: OrderTrackingProps) => {
  const handleTrackOrder = () => {
    if (order.tracking_number) {
      const trackingUrl = shippingService.generateTrackingUrl(order.tracking_number);
      window.open(trackingUrl, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstimatedDelivery = () => {
    if (!order.estimated_delivery_days) return null;
    
    const orderDate = new Date(order.created_at);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + order.estimated_delivery_days);
    
    return estimatedDate.toLocaleDateString();
  };

  return (
    <Card className="anong-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="anong-subheading text-lg text-anong-black">
              Order #{order.order_number}
            </CardTitle>
            <p className="anong-body-light text-sm text-anong-black/70 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.tracking_number ? (
          <div className="flex items-center justify-between p-3 bg-anong-gold/5 rounded-lg border border-anong-gold/30">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-anong-gold" />
              <div>
                <p className="anong-body font-semibold text-anong-black">
                  Tracking Number: {order.tracking_number}
                </p>
                <p className="anong-body-light text-sm text-anong-black/70">
                  Courier: The Courier Guy
                </p>
              </div>
            </div>
            <Button 
              onClick={handleTrackOrder}
              variant="outline"
              size="sm"
              className="anong-btn-secondary"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Track Package
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Package className="w-5 h-5 text-gray-500" />
            <div>
              <p className="anong-body font-semibold text-anong-black">
                Preparing for shipment
              </p>
              <p className="anong-body-light text-sm text-anong-black/70">
                We'll email you the tracking number once your order ships
              </p>
            </div>
          </div>
        )}

        {getEstimatedDelivery() && (
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <p className="anong-body-light text-sm text-blue-700">
              Estimated delivery: {getEstimatedDelivery()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderTracking;
