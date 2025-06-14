
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AdminMobileOverviewProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
  };
}

const AdminMobileOverview = ({ stats }: AdminMobileOverviewProps) => {
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">In catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMobileOverview;
