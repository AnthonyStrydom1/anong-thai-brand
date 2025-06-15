
import React from 'react';
import { useOrderManager } from '@/hooks/useOrderManager';
import OrderManagerHeader from './orders/OrderManagerHeader';
import OrderManagerStats from './orders/OrderManagerStats';
import OrderFiltersAdvanced from './orders/OrderFiltersAdvanced';
import OrderTable from './orders/OrderTable';
import OrderDialogs from './orders/OrderDialogs';

const OrderManager = () => {
  const {
    // State
    orders,
    filteredOrders,
    isLoading,
    selectedOrder,
    isOrderDialogOpen,
    statusFilter,
    paymentFilter,
    searchTerm,
    dateRange,
    deleteDialogOpen,
    orderToDelete,
    isDeleting,
    
    // Setters
    setIsOrderDialogOpen,
    setStatusFilter,
    setPaymentFilter,
    setSearchTerm,
    setDateRange,
    setDeleteDialogOpen,
    
    // Actions
    loadOrders,
    clearFilters,
    updateOrderStatus,
    updatePaymentStatus,
    updateTrackingNumber,
    viewOrderDetails,
    handleDeleteOrder,
    confirmDeleteOrder,
  } = useOrderManager();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrderManagerHeader onRefresh={loadOrders} />
      
      <OrderManagerStats orders={orders} />

      <OrderFiltersAdvanced
        statusFilter={statusFilter}
        paymentFilter={paymentFilter}
        searchTerm={searchTerm}
        dateRange={dateRange}
        onStatusFilterChange={setStatusFilter}
        onPaymentFilterChange={setPaymentFilter}
        onSearchChange={setSearchTerm}
        onDateRangeChange={setDateRange}
        onClearFilters={clearFilters}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Orders ({filteredOrders.length})
            </h2>
          </div>
        </div>
        
        <OrderTable
          filteredOrders={filteredOrders}
          onStatusUpdate={updateOrderStatus}
          onPaymentStatusUpdate={updatePaymentStatus}
          onViewDetails={viewOrderDetails}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>

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
