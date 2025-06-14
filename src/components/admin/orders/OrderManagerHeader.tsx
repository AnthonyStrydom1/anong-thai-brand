
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";

interface OrderManagerHeaderProps {
  onRefresh: () => void;
}

const OrderManagerHeader = ({ onRefresh }: OrderManagerHeaderProps) => {
  const { selectedCurrency } = useCurrency();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Order Manager</h1>
        <p className="text-gray-600 text-sm mt-1">
          All amounts displayed in {selectedCurrency.name} ({selectedCurrency.symbol})
        </p>
      </div>
      <Button onClick={onRefresh} variant="outline">
        Refresh Orders
      </Button>
    </div>
  );
};

export default OrderManagerHeader;
