
import { Package } from "lucide-react";

const OrdersLoadingState = () => {
  return (
    <div className="text-center">
      <Package className="w-8 h-8 animate-spin mx-auto mb-4 text-anong-black/50" />
      <p className="text-anong-black/70">Loading orders...</p>
    </div>
  );
};

export default OrdersLoadingState;
