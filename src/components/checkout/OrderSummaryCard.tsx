
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { ShippingRate } from "@/services/shippingService";

interface OrderSummaryCardProps {
  orderTotals: {
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
  };
  selectedShippingRate: ShippingRate | null;
  isProcessing: boolean;
  translations: {
    orderSummary: string;
    subtotal: string;
    vatAmount: string;
    shipping: string;
    total: string;
    placeOrder: string;
    processing: string;
  };
}

export const OrderSummaryCard = ({
  orderTotals,
  selectedShippingRate,
  isProcessing,
  translations
}: OrderSummaryCardProps) => {
  const { formatPrice } = useCurrency();
  const { items } = useCart();

  return (
    <Card className="anong-card sticky top-24">
      <CardHeader>
        <CardTitle className="anong-subheading text-xl text-anong-black">
          {translations.orderSummary}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between anong-body text-sm">
              <span className="text-anong-black/80">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-anong-black">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between anong-body">
            <span className="text-anong-black/80">{translations.subtotal}</span>
            <span className="text-anong-black">{formatPrice(orderTotals.subtotal)}</span>
          </div>
          <div className="flex justify-between anong-body">
            <span className="text-anong-black/80">{translations.vatAmount}</span>
            <span className="text-anong-black">{formatPrice(orderTotals.vatAmount)}</span>
          </div>
          <div className="flex justify-between anong-body">
            <span className="text-anong-black/80">{translations.shipping}</span>
            <span className="text-anong-black">
              {selectedShippingRate ? formatPrice(selectedShippingRate.cost) : '-'}
            </span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between anong-subheading text-lg">
          <span className="text-anong-black">{translations.total}</span>
          <span className="text-anong-black">{formatPrice(orderTotals.totalAmount)}</span>
        </div>
        
        <Button 
          type="submit" 
          className="w-full anong-btn-primary mt-6"
          disabled={isProcessing || !selectedShippingRate}
        >
          {isProcessing ? translations.processing : translations.placeOrder}
        </Button>
      </CardContent>
    </Card>
  );
};
