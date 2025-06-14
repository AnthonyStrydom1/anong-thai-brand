
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Package, Truck } from 'lucide-react';

interface OrderActionsProps {
  selectedOrders: string[];
  onSelectAll: (checked: boolean) => void;
  onBulkStatusUpdate: (status: string) => void;
  onExportOrders: () => void;
  totalOrders: number;
}

const OrderActions = ({
  selectedOrders,
  onSelectAll,
  onBulkStatusUpdate,
  onExportOrders,
  totalOrders
}: OrderActionsProps) => {
  const hasSelection = selectedOrders.length > 0;
  const isAllSelected = selectedOrders.length === totalOrders && totalOrders > 0;

  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label="Select all orders"
          />
          <span className="text-sm text-gray-600">
            {selectedOrders.length > 0 ? `${selectedOrders.length} selected` : 'Select all'}
          </span>
        </div>

        {hasSelection && (
          <div className="flex items-center space-x-2">
            <Select onValueChange={onBulkStatusUpdate}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Bulk Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Mark Processing
                  </div>
                </SelectItem>
                <SelectItem value="shipped">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Mark Shipped
                  </div>
                </SelectItem>
                <SelectItem value="delivered">Mark Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button variant="outline" onClick={onExportOrders}>
        <Download className="w-4 h-4 mr-2" />
        Export Orders
      </Button>
    </div>
  );
};

export default OrderActions;
