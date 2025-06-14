
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminTabsProps {
  activeTab: string;
}

const AdminTabs = ({ activeTab }: AdminTabsProps) => {
  return (
    <div className="mb-6">
      <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 h-auto p-1 bg-white border">
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
        <TabsTrigger value="customers" className="text-xs md:text-sm px-2 md:px-4 py-2">
          Customers
        </TabsTrigger>
        <TabsTrigger value="users" className="text-xs md:text-sm px-2 md:px-4 py-2">
          Users
        </TabsTrigger>
        <TabsTrigger value="security" className="text-xs md:text-sm px-2 md:px-4 py-2">
          Security
        </TabsTrigger>
        <TabsTrigger value="analytics" className="text-xs md:text-sm px-2 md:px-4 py-2">
          Analytics
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminTabs;
