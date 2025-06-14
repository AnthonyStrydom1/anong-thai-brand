
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
}

interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

interface OrdersByStatus {
  status: string;
  count: number;
  percentage: number;
}

const AnalyticsDashboard = () => {
  const { formatPrice } = useCurrency();
  const [dateRange, setDateRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    topProducts: [] as ProductSales[],
    revenueByDay: [] as RevenueByDay[],
    ordersByStatus: [] as OrdersByStatus[],
    customersByMonth: [],
    categoryPerformance: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const days = parseInt(dateRange.replace('d', ''));
      const startDate = startOfDay(subDays(new Date(), days));
      const endDate = endOfDay(new Date());

      // Get orders for the selected period
      const orders = await supabaseService.getAllOrders();
      const products = await supabaseService.getProducts();
      const customers = await supabaseService.supabase.from('customers').select('*');

      // Filter orders by date range
      const ordersInRange = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });

      // Calculate metrics
      const completedOrders = ordersInRange.filter(order => 
        order.status === 'delivered' || 
        (order.payment_status === 'paid' && order.status !== 'cancelled')
      );

      const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalOrders = ordersInRange.length;
      const totalCustomers = customers.data?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth rates (comparing to previous period)
      const previousStartDate = startOfDay(subDays(new Date(), days * 2));
      const previousEndDate = endOfDay(subDays(new Date(), days));
      
      const previousOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= previousStartDate && orderDate <= previousEndDate;
      });

      const previousCompletedOrders = previousOrders.filter(order => 
        order.status === 'delivered' || 
        (order.payment_status === 'paid' && order.status !== 'cancelled')
      );

      const previousRevenue = previousCompletedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      const orderGrowth = previousOrders.length > 0 ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100 : 0;

      // Revenue by day
      const revenueByDay: RevenueByDay[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayOrders = completedOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return format(orderDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        });
        
        revenueByDay.push({
          date: format(date, 'MMM dd'),
          revenue: dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
          orders: dayOrders.length
        });
      }

      // Orders by status
      const statusCounts: Record<string, number> = {};
      ordersInRange.forEach(order => {
        const status = order.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const ordersByStatus: OrdersByStatus[] = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        percentage: (count / totalOrders) * 100
      }));

      // Get order items for top products calculation
      const { data: orderItems } = await supabaseService.supabase
        .from('order_items')
        .select('*')
        .in('order_id', ordersInRange.map(order => order.id));

      // Top products
      const productSales: Record<string, ProductSales> = {};
      orderItems?.forEach(item => {
        if (!productSales[item.product_id || '']) {
          productSales[item.product_id || ''] = {
            name: item.product_name || 'Unknown Product',
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.product_id || ''].quantity += item.quantity || 0;
        productSales[item.product_id || ''].revenue += item.total_price || 0;
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        revenueGrowth,
        orderGrowth,
        customerGrowth: 0, // Would need historical customer data
        topProducts,
        revenueByDay,
        ordersByStatus,
        customersByMonth: [], // Would need more complex date grouping
        categoryPerformance: []
      });

    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-2))",
    },
  };

  const statusColors: Record<string, string> = {
    Pending: '#f59e0b',
    Processing: '#3b82f6',
    Shipped: '#8b5cf6',
    Delivered: '#10b981',
    Cancelled: '#ef4444'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your store's performance and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {analytics.revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(analytics.revenueGrowth).toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {analytics.orderGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(analytics.orderGrowth).toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per completed order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="orders">Order Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--color-revenue)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-revenue)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
                <CardDescription>Distribution of order statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.ordersByStatus}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        nameKey="status"
                      >
                        {analytics.ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={statusColors[entry.status] || '#8884d8'} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Order Count</CardTitle>
                <CardDescription>Number of orders per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.revenueByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" fill="var(--color-orders)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(product.revenue)}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))}
                {analytics.topProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No product sales data available for the selected period
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
