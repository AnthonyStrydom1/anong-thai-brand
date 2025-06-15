
import { useState, useEffect } from 'react';
import { ExtendedOrder } from './useOrderManager';

export const useOrderFilters = (orders: ExtendedOrder[]) => {
  const [filteredOrders, setFilteredOrders] = useState<ExtendedOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, paymentFilter, searchTerm, dateRange]);

  const applyFilters = () => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_status === paymentFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.order_number.toLowerCase().includes(term) ||
        order.customer_id.toString().includes(term)
      );
    }

    // Apply date range filter
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        const fromDate = dateRange.from ? new Date(dateRange.from.setHours(0, 0, 0, 0)) : null;
        const toDate = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : null;

        if (fromDate && toDate) {
          return orderDate >= fromDate && orderDate <= toDate;
        } else if (fromDate) {
          return orderDate >= fromDate;
        } else if (toDate) {
          return orderDate <= toDate;
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPaymentFilter('all');
    setSearchTerm('');
    setDateRange({});
  };

  return {
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
  };
};
