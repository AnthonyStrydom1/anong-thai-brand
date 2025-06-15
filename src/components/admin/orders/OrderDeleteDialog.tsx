
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

interface OrderDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

const OrderDeleteDialog = ({
  isOpen,
  onOpenChange,
  orderNumber,
  onConfirm,
  isDeleting
}: OrderDeleteDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete Order
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete order <strong>#{orderNumber}</strong>?
            <br /><br />
            This action will:
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Permanently remove the order from the system</li>
              <li>Restore product stock quantities</li>
              <li>Update customer totals if applicable</li>
              <li>Create an audit log entry</li>
            </ul>
            <br />
            <strong className="text-red-600">This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Order'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OrderDeleteDialog;
