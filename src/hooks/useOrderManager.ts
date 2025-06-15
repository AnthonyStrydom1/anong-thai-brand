
import { useEffect } from 'react';
import { useOrderState } from './useOrderState';
import { useOrderFilters } from './useOrderFilters';
import { useOrderActions } from './useOrderActions';
import { useOrderBulkOperations } from './useOrderBulkOperations';
import { useOrderOperations } from './useOrderOperations';

// Extended order type to include new fields
export interface ExtendedOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  vat_amount?: number | null;
  customer_id: number;
  created_at: string;
  tracking_number?: string | null;
  shipping_method?: string | null;
  courier_service?: string | null;
  estimated_delivery_days?: number | null;
  subtotal?: number;
  shipping_amount?: number;
  currency?: string;
}

export const useOrderManager = () => {
  const {
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
  } = useOrderState();

  const {
    filteredOrders,
    statusFilter,
    paymentFilter,
    searchTerm,
    dateRange,
    setStatusFilter,
    setPaymentFilter,
    setSearchTerm,
    setDateRange,
    clearFilters,
  } = useOrderFilters(orders);

  const {
    isDeleting,
    updateOrderStatus,
    updatePaymentStatus,
    updateTrackingNumber,
    confirmDeleteOrder,
  } = useOrderActions(orders, setOrders, selectedOrder, setSelectedOrder);

  const {
    handleSelectAll,
    handleBulkStatusUpdate,
    handleExportOrders,
  } = useOrderBulkOperations(selectedOrders, setSelectedOrders, filteredOrders, updateOrderStatus);

  const {
    loadOrders,
    viewOrderDetails,
  } = useOrderOperations(setOrders, setIsLoading, setSelectedOrder, setIsOrderDialogOpen);

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDeleteOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setOrderToDelete(order);
      setDeleteDialogOpen(true);
    }
  };

  const handleEditOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsStatusDialogOpen(true);
    }
  };

  const handleConfirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    await confirmDeleteOrder(orderToDelete);
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  return {
    // State
    orders,
    filteredOrders,
    isLoading,
    selectedOrder,
    isOrderDialogOpen,
    isStatusDialogOpen,
    selectedOrders,
    statusFilter,
    paymentFilter,
    searchTerm,
    dateRange,
    deleteDialogOpen,
    orderToDelete,
    isDeleting,
    
    // Setters
    setSelectedOrder,
    setIsOrderDialogOpen,
    setIsStatusDialogOpen,
    setSelectedOrders,
    setStatusFilter,
    setPaymentFilter,
    setSearchTerm,
    setDateRange,
    setDeleteDialogOpen,
    setOrderToDelete,
    
    // Actions
    loadOrders,
    clearFilters,
    handleSelectAll,
    handleBulkStatusUpdate,
    handleExportOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateTrackingNumber,
    viewOrderDetails,
    handleDeleteOrder,
    handleEditOrder,
    confirmDeleteOrder: handleConfirmDeleteOrder,
  };
};
