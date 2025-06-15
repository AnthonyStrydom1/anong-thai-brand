
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProductManager from '@/components/admin/ProductManager';
import OrderManager from '@/components/admin/OrderManager';
import CustomerManager from '@/components/admin/CustomerManager';
import StockManager from '@/components/admin/StockManager';
import SecurityDashboard from '@/components/admin/SecurityDashboard';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import UserManagement from '@/components/admin/UserManagement';
import ReviewManager from '@/components/admin/ReviewManager';
import EventManager from '@/components/admin/EventManager';
import MobileAdminLayout from '@/components/admin/MobileAdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminMobileOverview from '@/components/admin/AdminMobileOverview';
import { supabaseService } from '@/services/supabaseService';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  const isMobile = useIsMobile();

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return isMobile ? (
          <AdminMobileOverview stats={stats} />
        ) : (
          <AdminOverview stats={stats} onTabChange={setActiveTab} />
        );
      case 'products':
        return <ProductManager />;
      case 'stock':
        return <StockManager />;
      case 'orders':
        return <OrderManager />;
      case 'customers':
        return <CustomerManager />;
      case 'users':
        return <UserManagement />;
      case 'events':
        return <EventManager />;
      case 'reviews':
        return <ReviewManager />;
      case 'security':
        return <SecurityDashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      default:
        return null;
    }
  };

  if (isMobile) {
    return (
      <ProtectedAdminRoute>
        <MobileAdminLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
        >
          {renderTabContent()}
        </MobileAdminLayout>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-anong-ivory via-anong-cream to-anong-ivory thai-pattern-bg">
        <div className="flex-1 container mx-auto py-4 px-4 md:py-8">
          <AdminHeader />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <AdminTabs activeTab={activeTab} />

            <div className="mt-6">
              <TabsContent value="overview" className="mt-0">
                <AdminOverview stats={stats} onTabChange={setActiveTab} />
              </TabsContent>

              <TabsContent value="products" className="mt-0">
                <div className="anong-card p-6">
                  <ProductManager />
                </div>
              </TabsContent>

              <TabsContent value="stock" className="mt-0">
                <div className="anong-card p-6">
                  <StockManager />
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-0">
                <div className="anong-card p-6">
                  <OrderManager />
                </div>
              </TabsContent>

              <TabsContent value="customers" className="mt-0">
                <div className="anong-card p-6">
                  <CustomerManager />
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <div className="anong-card p-6">
                  <UserManagement />
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-0">
                <div className="anong-card p-6">
                  <EventManager />
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="anong-card p-6">
                  <ReviewManager />
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="anong-card p-6">
                  <SecurityDashboard />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="anong-card p-6">
                  <AnalyticsDashboard />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
};

export default AdminPage;
