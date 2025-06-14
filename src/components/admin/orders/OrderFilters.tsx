
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from 'lucide-react';

interface OrderFiltersProps {
  statusFilter: string;
  paymentFilter: string;
  searchTerm: string;
  onStatusFilterChange: (value: string) => void;
  onPaymentFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

const OrderFilters = ({
  statusFilter,
  paymentFilter,
  searchTerm,
  onStatusFilterChange,
  onPaymentFilterChange,
  onSearchChange,
  onClearFilters
}: OrderFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex items-center space-x-2 flex-1">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by order number or customer..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Payments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onClearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default OrderFilters;
