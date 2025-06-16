
import { Button } from "@/components/ui/button";
import { Truck, Loader2 } from "lucide-react";
import { useOrderShipping } from "@/hooks/useOrderShipping";

interface CreateShipmentButtonProps {
  orderId: string;
  orderNumber: string;
  currentStatus: string;
  hasTrackingNumber: boolean;
}

const CreateShipmentButton = ({ 
  orderId, 
  orderNumber, 
  currentStatus, 
  hasTrackingNumber 
}: CreateShipmentButtonProps) => {
  const { createShipmentForOrder, isCreatingShipment } = useOrderShipping();

  const canCreateShipment = currentStatus === 'processing' || currentStatus === 'pending';
  
  if (hasTrackingNumber || currentStatus === 'shipped' || currentStatus === 'delivered') {
    return null; // Don't show button if already shipped
  }

  const handleCreateShipment = async () => {
    await createShipmentForOrder(orderId);
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleCreateShipment}
      disabled={!canCreateShipment || isCreatingShipment}
      className="flex items-center space-x-1"
    >
      {isCreatingShipment ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Truck className="h-3 w-3" />
      )}
      <span className="text-xs">
        {isCreatingShipment ? 'Creating...' : 'Create Shipment'}
      </span>
    </Button>
  );
};

export default CreateShipmentButton;
