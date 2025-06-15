
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, CalendarIcon, X } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OrderFiltersAdvancedProps {
  statusFilter: string;
  paymentFilter: string;
  searchTerm: string;
  dateRange: { from?: Date; to?: Date };
  onStatusFilterChange: (value: string) => void;
  onPaymentFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onClearFilters: () => void;
}

const OrderFiltersAdvanced = ({
  statusFilter,
  paymentFilter,
  searchTerm,
  dateRange,
  onStatusFilterChange,
  onPaymentFilterChange,
  onSearchChange,
  onDateRangeChange,
  onClearFilters
}: OrderFiltersAdvancedProps) => {
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      // Start new range
      onDateRangeChange({ from: selectedDate, to: undefined });
    } else if (selectedDate < dateRange.from) {
      // Selected date is before start, make it the new start
      onDateRangeChange({ from: selectedDate, to: dateRange.from });
      setCalendarOpen(false);
    } else {
      // Complete the range
      onDateRangeChange({ from: dateRange.from, to: selectedDate });
      setCalendarOpen(false);
    }
  };

  const clearDateRange = () => {
    onDateRangeChange({ from: undefined, to: undefined });
  };

  const hasActiveFilters = statusFilter !== 'all' || paymentFilter !== 'all' || searchTerm || dateRange.from || dateRange.to;

  return (
    <div className="space-y-4 p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Order number, customer..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
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
        </div>

        {/* Payment Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Payment</label>
          <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
            <SelectTrigger>
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
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Date Range</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick dates</span>
                )}
                {(dateRange.from || dateRange.to) && (
                  <X 
                    className="ml-auto h-4 w-4 hover:text-red-500" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateRange();
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="single"
                selected={dateRange.from}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default OrderFiltersAdvanced;
