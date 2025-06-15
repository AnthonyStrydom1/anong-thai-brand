
import { useState, useEffect } from 'react';
import { supabaseService, SupabaseCustomer } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";

const CUSTOMERS_PER_PAGE = 10;

export const useCustomerData = () => {
  const [customers, setCustomers] = useState<SupabaseCustomer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, [currentPage, searchTerm]);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      
      const offset = (currentPage - 1) * CUSTOMERS_PER_PAGE;
      
      let query = supabaseService.supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + CUSTOMERS_PER_PAGE - 1);
      
      if (searchTerm) {
        query = query.or(`fullname.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Calculate actual total spent for each customer from orders
      const customersWithSpent = await Promise.all(
        (data || []).map(async (customer) => {
          try {
            const { data: orders, error: ordersError } = await supabaseService.supabase
              .from('orders')
              .select('total_amount, status, payment_status')
              .eq('customer_id', customer.id);
            
            if (ordersError) {
              console.error('Error fetching orders for customer:', customer.id, ordersError);
              return customer;
            }
            
            // Only count completed orders (delivered or paid status, excluding cancelled)
            const completedOrders = orders?.filter(order => 
              order.status === 'delivered' || 
              (order.payment_status === 'paid' && order.status !== 'cancelled')
            ) || [];
            
            const actualTotalSpent = completedOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
            
            return {
              ...customer,
              total_spent: actualTotalSpent,
              total_orders: orders?.length || 0
            };
          } catch (error) {
            console.error('Error calculating spent for customer:', customer.id, error);
            return customer;
          }
        })
      );
      
      setCustomers(customersWithSpent);
      setTotalCustomers(count || 0);
    } catch (error) {
      console.error('Load customers error:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const totalPages = Math.ceil(totalCustomers / CUSTOMERS_PER_PAGE);

  return {
    customers,
    totalCustomers,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    setCurrentPage,
    handleSearchChange
  };
};
