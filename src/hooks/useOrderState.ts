
import { useState } from 'react';
import { ExtendedOrder } from './useOrderManager';

export const useOrderState = () => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<ExtendedOrder | null>(null);

  return {
    orders,
    setOrders,
    isLoading,
    setIsLoading,
    selectedOrder,
    setSelectedOrder,
    isOrderDialogOpen,
    setIsOrderDialogOpen,
    isStatusDialogOpen,
    setIsStatusDialogOpen,
    selectedOrders,
    setSelectedOrders,
    deleteDialogOpen,
    setDeleteDialogOpen,
    orderToDelete,
    setOrderToDelete,
  };
};
