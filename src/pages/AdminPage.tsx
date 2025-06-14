import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductManager from '@/components/admin/ProductManager';
import OrderManager from '@/components/admin/OrderManager';
import CustomerManager from '@/components/admin/CustomerManager';
import StockManager from '@/components/admin/StockManager';
import SecurityDashboard from '@/components/admin/SecurityDashboard';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import NavigationBanner from '@/components/NavigationBanner';
import { Package, ShoppingCart, Users, BarChart3, Warehouse, Shield } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import { useCurrency } from '@/contexts/CurrencyContext';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });
  const { formatPrice } = useCurrency();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [products, orders, customers] = await Promise.all([
        supabaseService.getProducts(),
        supabaseService.getAllOrders(),
        supabaseService.supabase.from('customers').select('*')
      ]);

      // Only count revenue from completed orders (delivered or paid status)
      // Exclude cancelled, pending, and failed orders
      const completedOrders = orders.filter(order => 
        order.status === 'delivered' || 
        (order.payment_status === 'paid' && order.status !== 'cancelled')
      );
      
      // Calculate revenue in ZAR (base currency) from completed orders only
      const revenue = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      const lowStock = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length;
      const outOfStock = products.filter(p => p.stock_quantity === 0).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customers.data?.length || 0,
        totalRevenue: revenue, // This is now in ZAR and excludes cancelled orders
        lowStockItems: lowStock,
        outOfStockItems: outOfStock
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 container mx-auto py-4 px-4 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1 md:mt-2">Manage your e-commerce store</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-6">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 h-auto p-1 bg-white border">
                <TabsTrigger value="overview" className="text-xs md:text-sm px-2 md:px-4 py-2">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="products" className="text-xs md:text-sm px-2 md:px-4 py-2">
                  Products
                </TabsTrigger>
                <TabsTrigger value="stock" className="text-xs md:text-sm px-2 md:px-4 py-2">
                  Stock
                </TabsTrigger>
                <TabsTrigger value="orders" className="text-xs md:text-sm px-2 md:px-4 py-2">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="customers" className="text-xs md:text-sm px-2 md:px-4 py-2 md:col-span-1 col-span-2">
                  Customers
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs md:text-sm px-2 md:px-4 py-2 md:col-span-1 col-span-1">
                  Security
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs md:text-sm px-2 md:px-4 py-2 md:col-span-1 col-span-1">
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">Products</CardTitle>
                    <Package className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-lg md:text-2xl font-bold">{stats.totalProducts}</div>
                    <p className="text-xs text-muted-foreground">In catalog</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">Orders</CardTitle>
                    <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-lg md:text-2xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Total orders</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">Customers</CardTitle>
                    <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-lg md:text-2xl font-bold">{stats.totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">Registered</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">Revenue</CardTitle>
                    <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-lg md:text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">From completed orders</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Stock Alerts</CardTitle>
                    <CardDescription>Items requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <Warehouse className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
                        <div>
                          <h3 className="text-sm md:text-base font-semibold">Low Stock Items</h3>
                          <p className="text-xs md:text-sm text-gray-600">Items with 5 or fewer units</p>
                        </div>
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3">
                        <Package className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
                        <div>
                          <h3 className="text-sm md:text-base font-semibold">Out of Stock</h3>
                          <p className="text-xs md:text-sm text-gray-600">Items completely out of stock</p>
                        </div>
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-red-600">{stats.outOfStockItems}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <button 
                        onClick={() => setActiveTab('products')}
                        className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mb-2" />
                        <span className="text-xs md:text-sm font-medium text-center">Add Product</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('stock')}
                        className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Warehouse className="h-6 w-6 md:h-8 md:w-8 text-green-500 mb-2" />
                        <span className="text-xs md:text-sm font-medium text-center">Manage Stock</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mb-2" />
                        <span className="text-xs md:text-sm font-medium text-center">View Orders</span>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('customers')}
                        className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Users className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mb-2" />
                        <span className="text-xs md:text-sm font-medium text-center">View Customers</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <ProductManager />
            </TabsContent>

            <TabsContent value="stock">
              <StockManager />
            </TabsContent>

            <TabsContent value="orders">
              <OrderManager />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerManager />
            </TabsContent>

            <TabsContent value="security">
              <SecurityDashboard />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Sales analytics and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminPage;
