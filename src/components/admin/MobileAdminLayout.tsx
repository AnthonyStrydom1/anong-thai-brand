
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Users, BarChart3, Warehouse, Shield, UserPlus } from 'lucide-react';

interface MobileAdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
  };
}

const MobileAdminLayout = ({ children, activeTab, onTabChange, stats }: MobileAdminLayoutProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'stock', label: 'Stock', icon: Warehouse },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'users', label: 'Users', icon: UserPlus },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
        <div className="grid grid-cols-4 gap-1">
          {tabs.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center h-12 px-1"
              >
                <Icon className="w-4 h-4 mb-1" />
                <span className="text-xs truncate">{tab.label}</span>
              </Button>
            );
          })}
        </div>
        {tabs.length > 4 && (
          <div className="grid grid-cols-4 gap-1 mt-1">
            {tabs.slice(4).map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className="flex flex-col items-center h-12 px-1"
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-xs truncate">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileAdminLayout;
