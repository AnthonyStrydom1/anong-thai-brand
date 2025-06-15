
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupabaseCustomer } from "@/services/supabaseService";
import CustomerManagerHeader from './customer/CustomerManagerHeader';
import CustomerEmptyState from './customer/CustomerEmptyState';
import CustomerTable from './customer/CustomerTable';
import CustomerDetailsDialog from './customer/CustomerDetailsDialog';
import CustomerPagination from './customer/CustomerPagination';
import { useCustomerData } from '@/hooks/useCustomerData';

const CustomerManager = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<SupabaseCustomer | null>(null);
  
  const {
    customers,
    totalCustomers,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setCurrentPage,
    handleSearchChange
  } = useCustomerData();

  const handleViewCustomer = (customer: SupabaseCustomer) => {
    setSelectedCustomer(customer);
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return <div className="p-6">Loading customers...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <CustomerManagerHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {customers.length === 0 ? (
        <CustomerEmptyState searchTerm={searchTerm} />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                Customers ({totalCustomers} total)
                {searchTerm && ` - Showing results for "${searchTerm}"`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerDetailsDialog 
                selectedCustomer={selectedCustomer}
                formatCurrency={formatCurrency}
              >
                <CustomerTable
                  customers={customers}
                  onViewCustomer={handleViewCustomer}
                  formatCurrency={formatCurrency}
                />
              </CustomerDetailsDialog>
            </CardContent>
          </Card>

          <CustomerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default CustomerManager;
