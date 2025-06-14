
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const OrdersEmptyState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
        <p className="text-gray-500 text-center">
          Orders will appear here once customers start making purchases.
        </p>
      </CardContent>
    </Card>
  );
};

export default OrdersEmptyState;
