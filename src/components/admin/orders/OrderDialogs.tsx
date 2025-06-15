
import React from 'react';
import OrderDetailsDialog from './OrderDetailsDialog';
import OrderDeleteDialog from './OrderDeleteDialog';
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
}

const OrderDialogs = ({
  isOrderDialogOpen,
  onOrderDialogOpenChange,
  selectedOrder,
  deleteDialogOpen,
  onDeleteDialogOpenChange,
  orderToDelete,
  onConfirmDelete,
  isDeleting
}: OrderDialogsProps) => {
  return (
    <>
      <OrderDetailsDialog
        isOpen={isOrderDialogOpen}
        onOpenChange={onOrderDialogOpenChange}
        selectedOrder={selectedOrder}
      />

      <OrderDeleteDialog
        isOpen={deleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
        orderNumber={orderToDelete?.order_number || ''}
        onConfirm={onConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default OrderDialogs;
