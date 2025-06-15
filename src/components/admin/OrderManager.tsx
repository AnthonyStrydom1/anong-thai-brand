
import React from 'react';
import { useOrderManager } from '@/hooks/useOrderManager';
import OrderManagerHeader from './orders/OrderManagerHeader';
import OrderManagerStats from './orders/OrderManagerStats';
import OrderFilters from './orders/OrderFilters';
import OrderActions from './orders/OrderActions';
import OrderList from './orders/OrderList';
import OrderDialogs from './orders/OrderDialogs';

const OrderManager = () => {
  const {
    // State
    orders,
    filteredOrders,
    isLoading,
    selectedOrder,
    isOrderDialogOpen,
    selectedOrders,
    statusFilter,
    paymentFilter,
    searchTerm,
    deleteDialogOpen,
    orderToDelete,
    isDeleting,
    
    // Setters
    setIsOrderDialogOpen,
    setStatusFilter,
    setPaymentFilter,
    setSearchTerm,
    setDeleteDialogOpen,
    
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
    confirmDeleteOrder,
  } = useOrderManager();

  if (isLoading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <OrderManagerHeader onRefresh={loadOrders} />
      
      <OrderManagerStats orders={orders} />

      <OrderFilters
        statusFilter={statusFilter}
        paymentFilter={paymentFilter}
        searchTerm={searchTerm}
        onStatusFilterChange={setStatusFilter}
        onPaymentFilterChange={setPaymentFilter}
        onSearchChange={setSearchTerm}
        onClearFilters={clearFilters}
      />

      <OrderActions
        selectedOrders={selectedOrders}
        onSelectAll={handleSelectAll}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onExportOrders={handleExportOrders}
        totalOrders={filteredOrders.length}
      />

      <OrderList
        filteredOrders={filteredOrders}
        onStatusUpdate={updateOrderStatus}
        onPaymentStatusUpdate={updatePaymentStatus}
        onTrackingUpdate={updateTrackingNumber}
        onViewDetails={viewOrderDetails}
        onDeleteOrder={handleDeleteOrder}
      />

      <OrderDialogs
        isOrderDialogOpen={isOrderDialogOpen}
        onOrderDialogOpenChange={setIsOrderDialogOpen}
        selectedOrder={selectedOrder}
        deleteDialogOpen={deleteDialogOpen}
        onDeleteDialogOpenChange={setDeleteDialogOpen}
        orderToDelete={orderToDelete}
        onConfirmDelete={confirmDeleteOrder}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default OrderManager;
