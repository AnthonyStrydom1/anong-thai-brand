
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface PaymentMethodCardProps {
  translations: {
    paymentMethod: string;
    eftPayment: string;
  };
}

export const PaymentMethodCard = ({ translations }: PaymentMethodCardProps) => {
  return (
    <Card className="anong-card">
      <CardHeader>
        <CardTitle className="anong-subheading text-xl text-anong-black">
          {translations.paymentMethod}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 p-4 border rounded-lg bg-anong-gold/5 border-anong-gold/30">
          <Building2 className="w-5 h-5 text-anong-gold" />
          <div>
            <p className="anong-body text-anong-black font-semibold">{translations.eftPayment}</p>
            <p className="anong-body text-anong-black/70 text-sm">Bank transfer payment method</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
