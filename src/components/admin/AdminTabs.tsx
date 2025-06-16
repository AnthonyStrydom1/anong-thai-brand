
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from './UserManagement';
import CustomerManager from './CustomerManager';
import OrderManager from './OrderManager';
import ProductManager from './ProductManager';
import EventManager from './EventManager';
import StockManager from './StockManager';
import ReviewManager from './ReviewManager';
import SecurityDashboard from './SecurityDashboard';
import AnalyticsDashboard from './AnalyticsDashboard';
import OrphanedUserManager from './OrphanedUserManager';

const AdminTabs = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 gap-1 h-auto p-1">
      <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
      <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
      <TabsTrigger value="orphaned" className="text-xs">Orphaned</TabsTrigger>
      <TabsTrigger value="customers" className="text-xs">Customers</TabsTrigger>
      <TabsTrigger value="orders" className="text-xs">Orders</TabsTrigger>
      <TabsTrigger value="products" className="text-xs">Products</TabsTrigger>
      <TabsTrigger value="events" className="text-xs">Events</TabsTrigger>
      <TabsTrigger value="stock" className="text-xs">Stock</TabsTrigger>
      <TabsTrigger value="reviews" className="text-xs">Reviews</TabsTrigger>
      <TabsTrigger value="newsletter" className="text-xs">Newsletter</TabsTrigger>
      <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
      <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
    </TabsList>
  );
};

export default AdminTabs;
