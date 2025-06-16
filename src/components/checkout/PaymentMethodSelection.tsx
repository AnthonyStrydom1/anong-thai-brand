
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, Zap } from "lucide-react";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";

interface PaymentMethodSelectionProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  translations: {
    paymentMethod: string;
  };
}

export const PaymentMethodSelection = ({ 
  selectedMethod, 
  onMethodChange, 
  translations 
}: PaymentMethodSelectionProps) => {
  const { getPaymentMethods, getPaymentStatus } = usePaymentProcessing();
  const paymentMethods = getPaymentMethods();
  const paymentStatus = getPaymentStatus();

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'eft':
        return <Building2 className="w-5 h-5" />;
      case 'payfast_card':
        return <CreditCard className="w-5 h-5" />;
      case 'payfast_eft':
        return <Zap className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getMethodColor = (methodId: string) => {
    switch (methodId) {
      case 'eft':
        return 'text-anong-gold';
      case 'payfast_card':
        return paymentStatus.isEnabled ? 'text-green-600' : 'text-gray-400';
      case 'payfast_eft':
        return paymentStatus.isEnabled ? 'text-blue-600' : 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="anong-card">
      <CardHeader>
        <CardTitle className="anong-subheading text-xl text-anong-black flex items-center justify-between">
          {translations.paymentMethod}
          {paymentStatus.isEnabled && (
            <Badge variant="default" className="text-xs">
              PayFast Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={method.id} id={method.id} />
              <div className={`${getMethodColor(method.id)}`}>
                {getMethodIcon(method.id)}
              </div>
              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                <div>
                  <p className="anong-body text-anong-black font-semibold">{method.name}</p>
                  <p className="anong-body text-anong-black/70 text-sm">{method.description}</p>
                </div>
              </Label>
              {method.id !== 'eft' && !paymentStatus.isEnabled && (
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
