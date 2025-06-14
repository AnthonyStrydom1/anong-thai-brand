
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrder: any;
}

const OrderDetailsDialog = ({ isOpen, onOpenChange, selectedOrder }: OrderDetailsDialogProps) => {
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

  if (!selectedOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details - #{selectedOrder?.order_number}</DialogTitle>
        </DialogHeader>
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
              <p className="font-semibold">Subtotal (excl. VAT):</p>
              <p>{formatPrice(selectedOrder.subtotal)}</p>
            </div>
            <div>
              <p className="font-semibold">VAT Amount:</p>
              <p>{formatPrice(selectedOrder.vat_amount || 0)}</p>
            </div>
            <div>
              <p className="font-semibold">Shipping:</p>
              <p>{formatPrice(selectedOrder.shipping_amount || 0)}</p>
            </div>
            <div>
              <p className="font-semibold">Total Amount:</p>
              <p className="font-bold">{formatPrice(selectedOrder.total_amount)}</p>
            </div>
            <div>
              <p className="font-semibold">Currency:</p>
              <p>{selectedOrder.currency}</p>
            </div>
            <div>
              <p className="font-semibold">Created:</p>
              <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
            </div>
            {selectedOrder.tracking_number && (
              <div className="col-span-2">
                <p className="font-semibold">Tracking Number:</p>
                <div className="flex items-center space-x-2">
                  <p>{selectedOrder.tracking_number}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(
                      `https://www.thecourierguy.co.za/track-and-trace?tracking_number=${selectedOrder.tracking_number}`,
                      '_blank'
                    )}
                  >
                    Track Order
                  </Button>
                </div>
              </div>
            )}
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
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
