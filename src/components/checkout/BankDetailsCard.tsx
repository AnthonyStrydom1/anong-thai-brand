
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface BankDetailsCardProps {
  orderNumber: string;
  total: number;
  translations: {
    bankDetails: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchCode: string;
    paymentInstructions: string;
    paymentNote: string;
  };
}

export const BankDetailsCard = ({ orderNumber, total, translations }: BankDetailsCardProps) => {
  const { formatPrice } = useCurrency();

  return (
    <Card className="anong-card mb-6">
      <CardHeader>
        <CardTitle className="anong-subheading text-xl text-anong-black flex items-center">
          <Building2 className="w-5 h-5 mr-2" />
          {translations.bankDetails}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="anong-body text-anong-black font-semibold">{translations.bankName}</Label>
            <p className="anong-body text-anong-black">First National Bank</p>
          </div>
          <div>
            <Label className="anong-body text-anong-black font-semibold">{translations.accountName}</Label>
            <p className="anong-body text-anong-black">Anong Restaurant</p>
          </div>
          <div>
            <Label className="anong-body text-anong-black font-semibold">{translations.accountNumber}</Label>
            <p className="anong-body text-anong-black font-mono">1234567890</p>
          </div>
          <div>
            <Label className="anong-body text-anong-black font-semibold">{translations.branchCode}</Label>
            <p className="anong-body text-anong-black font-mono">250655</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-anong-gold/10 rounded-lg border border-anong-gold/30">
          <h4 className="anong-subheading text-anong-black font-semibold mb-2">{translations.paymentInstructions}</h4>
          <p className="anong-body text-anong-black/80 text-sm">
            {translations.paymentNote}
          </p>
          <p className="anong-body text-anong-black font-semibold mt-2">
            Reference: {orderNumber}
          </p>
          <p className="anong-body text-anong-black font-semibold">
            Amount: {formatPrice(total)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
