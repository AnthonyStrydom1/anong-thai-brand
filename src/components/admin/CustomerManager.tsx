
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Users, Search, Eye, Mail, Phone, Calendar } from "lucide-react";
import { supabaseService, SupabaseCustomer } from "@/services/supabaseService";
import { toast } from "@/hooks/use-toast";

const CUSTOMERS_PER_PAGE = 10;

const CustomerManager = () => {
  const [customers, setCustomers] = useState<SupabaseCustomer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<SupabaseCustomer | null>(null);

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

  const handleViewCustomer = (customer: SupabaseCustomer) => {
    setSelectedCustomer(customer);
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  const totalPages = Math.ceil(totalCustomers / CUSTOMERS_PER_PAGE);

  if (isLoading) {
    return <div className="p-6">Loading customers...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Customers Found</h3>
            <p className="text-gray-500 text-center">
              {searchTerm ? 'No customers match your search criteria.' : 'No customers have registered yet.'}
            </p>
          </CardContent>
        </Card>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.fullname}</p>
                          <p className="text-sm text-gray-500">ID: {customer.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{customer.total_orders || 0}</TableCell>
                      <TableCell>{formatCurrency(customer.total_spent || 0)}</TableCell>
                      <TableCell>
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.is_active ? "default" : "secondary"}>
                          {customer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewCustomer(customer)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="text-sm">{selectedCustomer.fullname}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-sm">{selectedCustomer.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="text-sm">{selectedCustomer.phone || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Customer ID</label>
                                    <p className="text-sm">{selectedCustomer.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Total Orders</label>
                                    <p className="text-sm">{selectedCustomer.total_orders || 0}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Total Spent</label>
                                    <p className="text-sm font-semibold text-green-600">
                                      {formatCurrency(selectedCustomer.total_spent || 0)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <Badge variant={selectedCustomer.is_active ? "default" : "secondary"}>
                                      {selectedCustomer.is_active ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="w-4 h-4 text-gray-400" />
                                      <p className="text-sm">
                                        {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString() : 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === pageNum}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerManager;
