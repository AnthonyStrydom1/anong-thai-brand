
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Eye, Target, Award } from 'lucide-react';
import { supabaseService } from '@/services/supabaseService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface ProductSales {
  name: string;
  quantity: number;
  revenue: number;
  fill: string;
}

interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
  fill?: string;
}

interface OrdersByStatus {
  status: string;
  count: number;
  percentage: number;
  fill: string;
}

interface CategoryPerformance {
  category: string;
  revenue: number;
  orders: number;
  fill: string;
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
    conversionRate: 0,
    topProducts: [] as ProductSales[],
    revenueByDay: [] as RevenueByDay[],
    ordersByStatus: [] as OrdersByStatus[],
    categoryPerformance: [] as CategoryPerformance[]
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
      const averageOrderValue = totalOrders > 0 ? totalRevenue / completedOrders.length : 0;

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

      // Calculate conversion rate (completed orders / total orders)
      const conversionRate = totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0;

      // Revenue by day with colors
      const revenueByDay: RevenueByDay[] = [];
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayOrders = completedOrders.filter(order => {
          const orderDate = new Date(order.created_at);
          return format(orderDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
        });
        
        revenueByDay.push({
          date: format(date, 'MMM dd'),
          revenue: dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
          orders: dayOrders.length,
          fill: colors[i % colors.length]
        });
      }

      // Orders by status with proper colors and labels
      const statusMapping = {
        'pending': { label: 'Pending', color: '#f59e0b' },
        'processing': { label: 'Processing', color: '#3b82f6' },
        'shipped': { label: 'Shipped', color: '#8b5cf6' },
        'delivered': { label: 'Delivered', color: '#10b981' },
        'cancelled': { label: 'Cancelled', color: '#ef4444' }
      };

      const statusCounts: Record<string, number> = {};
      ordersInRange.forEach(order => {
        const status = order.status || 'pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const ordersByStatus: OrdersByStatus[] = Object.entries(statusCounts).map(([status, count]) => ({
        status: statusMapping[status as keyof typeof statusMapping]?.label || status.charAt(0).toUpperCase() + status.slice(1),
        count,
        percentage: (count / totalOrders) * 100,
        fill: statusMapping[status as keyof typeof statusMapping]?.color || '#6b7280'
      }));

      // Get order items for top products calculation
      const { data: orderItems } = await supabaseService.supabase
        .from('order_items')
        .select('*')
        .in('order_id', ordersInRange.map(order => order.id));

      // Top products with colors
      const productSales: Record<string, ProductSales> = {};
      const productColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
      
      orderItems?.forEach(item => {
        if (!productSales[item.product_id || '']) {
          productSales[item.product_id || ''] = {
            name: item.product_name || 'Unknown Product',
            quantity: 0,
            revenue: 0,
            fill: productColors[Object.keys(productSales).length % productColors.length]
          };
        }
        productSales[item.product_id || ''].quantity += item.quantity || 0;
        productSales[item.product_id || ''].revenue += item.total_price || 0;
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map((product, index) => ({
          ...product,
          fill: productColors[index]
        }));

      // Category performance (mock data for now since we don't have category info in orders)
      const categoryPerformance: CategoryPerformance[] = [
        { category: 'Main Dishes', revenue: totalRevenue * 0.4, orders: Math.floor(totalOrders * 0.35), fill: '#10b981' },
        { category: 'Appetizers', revenue: totalRevenue * 0.25, orders: Math.floor(totalOrders * 0.3), fill: '#3b82f6' },
        { category: 'Desserts', revenue: totalRevenue * 0.2, orders: Math.floor(totalOrders * 0.2), fill: '#8b5cf6' },
        { category: 'Beverages', revenue: totalRevenue * 0.15, orders: Math.floor(totalOrders * 0.15), fill: '#f59e0b' }
      ];

      setAnalytics({
        totalRevenue,
        totalOrders,
        totalCustomers,
        averageOrderValue,
        revenueGrowth,
        orderGrowth,
        customerGrowth: 0,
        conversionRate,
        topProducts,
        revenueByDay,
        ordersByStatus,
        categoryPerformance
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
    status: {
      label: "Status",
      color: "hsl(var(--chart-3))",
    },
    category: {
      label: "Category",
      color: "hsl(var(--chart-4))",
    },
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
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Track your store's performance and insights</p>
        </div>
        <div className="flex items-center space-x-2 bg-white rounded-lg border px-3 py-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="border-none bg-transparent text-sm font-medium focus:outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(analytics.totalRevenue)}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              {analytics.revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analytics.revenueGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">from last period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              {analytics.orderGrowth >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analytics.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analytics.orderGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">from last period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
            <Target className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(analytics.averageOrderValue)}</div>
            <p className="text-xs text-gray-600">Per completed order</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            <Award className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">Orders completed successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>Daily revenue for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.revenueByDay}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        labelFormatter={(value) => `Date: ${value}`}
                        formatter={(value, name) => [
                          name === 'revenue' ? formatPrice(Number(value)) : value, 
                          name === 'revenue' ? 'Revenue' : 'Orders'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  Order Status Distribution
                </CardTitle>
                <CardDescription>Current status of all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, percentage }) => `${status}: ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name, props) => [
                          `${value} orders (${props.payload.percentage.toFixed(1)}%)`,
                          props.payload.status
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Revenue Trend</CardTitle>
                <CardDescription>Revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.revenueByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Performance across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.categoryPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Order Count</CardTitle>
                <CardDescription>Number of orders per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.revenueByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Order Status</CardTitle>
                <CardDescription>Complete breakdown of order statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.ordersByStatus.map((status, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: status.fill }}
                        ></div>
                        <span className="font-medium">{status.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{status.count} orders</div>
                        <div className="text-sm text-gray-600">{status.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by revenue in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full font-semibold text-white" style={{ backgroundColor: product.fill }}>
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{formatPrice(product.revenue)}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))}
                {analytics.topProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No product data available</h3>
                    <p className="text-gray-600">No product sales data available for the selected period</p>
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
