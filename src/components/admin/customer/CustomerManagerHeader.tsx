
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerManagerHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CustomerManagerHeader = ({ searchTerm, onSearchChange }: CustomerManagerHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Customer Management</h1>
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default CustomerManagerHeader;
