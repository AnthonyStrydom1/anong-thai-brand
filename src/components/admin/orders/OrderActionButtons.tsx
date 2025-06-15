
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Package, Truck } from 'lucide-react';

interface OrderActionButtonsProps {
  orderId: string;
  onViewDetails: (orderId: string) => void;
  onEditOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onMarkShipped?: (orderId: string) => void;
}

const OrderActionButtons = ({
  orderId,
  onViewDetails,
  onEditOrder,
  onDeleteOrder,
  onMarkShipped
}: OrderActionButtonsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(orderId)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditOrder(orderId)}>
          <Edit className="mr-2 h-4 w-4" />
          Update Status
        </DropdownMenuItem>
        {onMarkShipped && (
          <DropdownMenuItem onClick={() => onMarkShipped(orderId)}>
            <Truck className="mr-2 h-4 w-4" />
            Mark as Shipped
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onDeleteOrder(orderId)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Order
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActionButtons;
