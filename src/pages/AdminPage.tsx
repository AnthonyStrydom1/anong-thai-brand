
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductManager from '@/components/admin/ProductManager';
import OrderManager from '@/components/admin/OrderManager';
import CustomerManager from '@/components/admin/CustomerManager';
import StockManager from '@/components/admin/StockManager';
import { Package, ShoppingCart, Users, BarChart3, Warehouse } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';

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

      const revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const lowStock = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length;
      const outOfStock = products.filter(p => p.stock_quantity === 0).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customers.data?.length || 0,
        totalRevenue: revenue,
        lowStockItems: lowStock,
        outOfStockItems: outOfStock
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your e-commerce store</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Products in catalog</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders placed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">Registered customers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total revenue</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Alerts</CardTitle>
                  <CardDescription>Items requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-center space-x-3">
                      <Warehouse className="h-8 w-8 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold">Low Stock Items</h3>
                        <p className="text-sm text-gray-600">Items with 5 or fewer units</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex items-center space-x-3">
                      <Package className="h-8 w-8 text-red-600" />
                      <div>
                        <h3 className="font-semibold">Out of Stock</h3>
                        <p className="text-sm text-gray-600">Items completely out of stock</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setActiveTab('products')}
                      className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Package className="h-8 w-8 text-blue-500 mb-2" />
                      <span className="text-sm font-medium">Add Product</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('stock')}
                      className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Warehouse className="h-8 w-8 text-green-500 mb-2" />
                      <span className="text-sm font-medium">Manage Stock</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ShoppingCart className="h-8 w-8 text-purple-500 mb-2" />
                      <span className="text-sm font-medium">View Orders</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('customers')}
                      className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Users className="h-8 w-8 text-orange-500 mb-2" />
                      <span className="text-sm font-medium">View Customers</span>
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
  );
};

export default AdminPage;
