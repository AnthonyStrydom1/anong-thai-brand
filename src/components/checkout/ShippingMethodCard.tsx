
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { ShippingRate } from "@/services/shippingService";
import { useCurrency } from "@/contexts/CurrencyContext";

interface ShippingMethodCardProps {
  shippingRates: ShippingRate[];
  selectedShippingRate: ShippingRate | null;
  onShippingRateChange: (rate: ShippingRate | null) => void;
  isCalculatingShipping: boolean;
  translations: {
    shippingMethod: string;
    calculatingShipping: string;
  };
}

export const ShippingMethodCard = ({
  shippingRates,
  selectedShippingRate,
  onShippingRateChange,
  isCalculatingShipping,
  translations
}: ShippingMethodCardProps) => {
  const { formatPrice } = useCurrency();

  if (shippingRates.length === 0 && !isCalculatingShipping) {
    return null;
  }

  return (
    <Card className="anong-card">
      <CardHeader>
        <CardTitle className="anong-subheading text-xl text-anong-black flex items-center">
          <Truck className="w-5 h-5 mr-2" />
          {translations.shippingMethod}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCalculatingShipping ? (
          <div className="text-center py-4">
            <p className="anong-body text-anong-black/70">{translations.calculatingShipping}</p>
          </div>
        ) : (
          <RadioGroup 
            value={selectedShippingRate?.service || ''} 
            onValueChange={(value) => {
              const rate = shippingRates.find(r => r.service === value);
              onShippingRateChange(rate || null);
            }}
          >
            {shippingRates.map((rate) => (
              <div key={rate.service} className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value={rate.service} id={rate.service} />
                <Label htmlFor={rate.service} className="flex-1 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="anong-body font-semibold text-anong-black">{rate.description}</p>
                      <p className="anong-body-light text-sm text-anong-black/70">
                        Estimated delivery: {rate.estimatedDays} business days
                      </p>
                    </div>
                    <span className="anong-body font-semibold text-anong-black">
                      {formatPrice(rate.cost)}
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};
