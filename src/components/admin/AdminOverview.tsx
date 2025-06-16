import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, BarChart3, Warehouse } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import PaymentIntegrationStatus from './payments/PaymentIntegrationStatus';
import ShippingIntegrationStatus from './orders/ShippingIntegrationStatus';

interface AdminOverviewProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
  onTabChange: (tab: string) => void;
}

const AdminOverview = ({ stats, onTabChange }: AdminOverviewProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-6">
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

      {/* Integration Status Cards */}
      <div className="space-y-4">
        <ShippingIntegrationStatus />
        <PaymentIntegrationStatus />
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
                onClick={() => onTabChange('products')}
                className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Package className="h-6 w-6 md:h-8 md:w-8 text-blue-500 mb-2" />
                <span className="text-xs md:text-sm font-medium text-center">Add Product</span>
              </button>
              
              <button 
                onClick={() => onTabChange('stock')}
                className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Warehouse className="h-6 w-6 md:h-8 md:w-8 text-green-500 mb-2" />
                <span className="text-xs md:text-sm font-medium text-center">Manage Stock</span>
              </button>
              
              <button 
                onClick={() => onTabChange('orders')}
                className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-purple-500 mb-2" />
                <span className="text-xs md:text-sm font-medium text-center">View Orders</span>
              </button>
              
              <button 
                onClick={() => onTabChange('customers')}
                className="flex flex-col items-center p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="h-6 w-6 md:h-8 md:w-8 text-orange-500 mb-2" />
                <span className="text-xs md:text-sm font-medium text-center">View Customers</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
