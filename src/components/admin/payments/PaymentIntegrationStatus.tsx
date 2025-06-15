
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { enhancedPaymentService } from "@/services/payments/enhancedPaymentService";

const PaymentIntegrationStatus = () => {
  const paymentStatus = enhancedPaymentService.getPaymentStatus();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>PayFast Integration</span>
          <Badge variant={paymentStatus.isEnabled ? "default" : "secondary"}>
            {paymentStatus.isEnabled ? "Active" : "Manual Processing"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          {paymentStatus.isEnabled ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">
              {paymentStatus.message}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Available Payment Methods:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">●</span>
                  <span>EFT/Bank Transfer (Manual)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={paymentStatus.isEnabled ? "text-green-500" : "text-orange-500"}>●</span>
                  <span>Credit/Debit Cards via PayFast</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={paymentStatus.isEnabled ? "text-green-500" : "text-orange-500"}>●</span>
                  <span>Instant EFT via PayFast</span>
                </li>
              </ul>
            </div>

            {!paymentStatus.isEnabled && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-blue-900 mb-2">Setup PayFast Integration:</h4>
                <ol className="text-xs text-blue-800 space-y-1">
                  <li>1. Register a business account with PayFast</li>
                  <li>2. Complete business verification</li>
                  <li>3. Get your Merchant ID and Merchant Key</li>
                  <li>4. Add credentials to your Supabase secrets</li>
                  <li>5. Update the PayFastService configuration</li>
                </ol>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => window.open('https://www.payfast.co.za/registration/', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Register with PayFast
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentIntegrationStatus;
