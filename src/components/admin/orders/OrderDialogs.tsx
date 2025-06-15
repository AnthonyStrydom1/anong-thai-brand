
import React from 'react';
import OrderDetailsDialog from './OrderDetailsDialog';
import OrderStatusUpdateDialog from './OrderStatusUpdateDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ExtendedOrder } from '@/hooks/useOrderManager';

interface OrderDialogsProps {
  isOrderDialogOpen: boolean;
  onOrderDialogOpenChange: (open: boolean) => void;
  selectedOrder: any;
  deleteDialogOpen: boolean;
  onDeleteDialogOpenChange: (open: boolean) => void;
  orderToDelete: ExtendedOrder | null;
  onConfirmDelete: () => void;
  isDeleting: boolean;
  // New props for status update dialog
  isStatusDialogOpen?: boolean;
  onStatusDialogOpenChange?: (open: boolean) => void;
  onStatusUpdate?: (orderId: string, status: string) => void;
  onPaymentStatusUpdate?: (orderId: string, paymentStatus: string) => void;
  onTrackingUpdate?: (orderId: string, trackingNumber: string) => void;
}

const OrderDialogs = ({
  isOrderDialogOpen,
  onOrderDialogOpenChange,
  selectedOrder,
  deleteDialogOpen,
  onDeleteDialogOpenChange,
  orderToDelete,
  onConfirmDelete,
  isDeleting,
  isStatusDialogOpen = false,
  onStatusDialogOpenChange = () => {},
  onStatusUpdate = () => {},
  onPaymentStatusUpdate = () => {},
  onTrackingUpdate = () => {}
}: OrderDialogsProps) => {
  return (
    <>
      {/* Order Details Dialog */}
      <OrderDetailsDialog
        isOpen={isOrderDialogOpen}
        onOpenChange={onOrderDialogOpenChange}
        selectedOrder={selectedOrder}
      />

      {/* Order Status Update Dialog */}
      <OrderStatusUpdateDialog
        isOpen={isStatusDialogOpen}
        onOpenChange={onStatusDialogOpenChange}
        order={selectedOrder}
        onStatusUpdate={onStatusUpdate}
        onPaymentStatusUpdate={onPaymentStatusUpdate}
        onTrackingUpdate={onTrackingUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order #{orderToDelete?.order_number}? 
              This action cannot be undone and will restore any reserved stock.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderDialogs;
