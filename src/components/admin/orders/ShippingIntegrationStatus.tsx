
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { enhancedShippingService } from "@/services/shipping/enhancedShippingService";

const ShippingIntegrationStatus = () => {
  const isApiEnabled = enhancedShippingService.isApiIntegrationEnabled();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="h-5 w-5" />
          <span>Courier Guy Integration</span>
          <Badge variant={isApiEnabled ? "default" : "secondary"}>
            {isApiEnabled ? "Active" : "Estimated Rates"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-3">
          {isApiEnabled ? (
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">
              {isApiEnabled ? (
                "Full API integration active. Automatic shipment creation and real-time tracking available."
              ) : (
                "Currently using estimated shipping rates. Connect to Courier Guy API for automatic shipment creation, real-time rates, and tracking."
              )}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Available Features:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center space-x-2">
                  <span className={isApiEnabled ? "text-green-500" : "text-orange-500"}>●</span>
                  <span>Real-time shipping quotes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={isApiEnabled ? "text-green-500" : "text-orange-500"}>●</span>
                  <span>Automatic waybill generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={isApiEnabled ? "text-green-500" : "text-orange-500"}>●</span>
                  <span>Shipment tracking integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className={isApiEnabled ? "text-green-500" : "text-orange-500"}>●</span>
                  <span>Collection scheduling</span>
                </li>
              </ul>
            </div>

            {!isApiEnabled && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-sm text-blue-900 mb-2">Setup API Integration:</h4>
                <ol className="text-xs text-blue-800 space-y-1">
                  <li>1. Contact Courier Guy to set up a business account</li>
                  <li>2. Request API credentials (username/password or API key)</li>
                  <li>3. Add credentials to your Supabase secrets</li>
                  <li>4. Update the CourierGuyAPIService configuration</li>
                </ol>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => window.open('https://www.thecourierguy.co.za/business', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Contact Courier Guy
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingIntegrationStatus;
