
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { SupabaseCustomer } from "@/services/supabaseService";

interface CustomerDetailsDialogProps {
  selectedCustomer: SupabaseCustomer | null;
  formatCurrency: (amount: number) => string;
  children: React.ReactNode;
}

const CustomerDetailsDialog = ({ selectedCustomer, formatCurrency, children }: CustomerDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-sm">{selectedCustomer.fullname}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm">{selectedCustomer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-sm">{selectedCustomer.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Customer ID</label>
                <p className="text-sm">{selectedCustomer.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Orders</label>
                <p className="text-sm">{selectedCustomer.total_orders || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Spent</label>
                <p className="text-sm font-semibold text-green-600">
                  {formatCurrency(selectedCustomer.total_spent || 0)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge variant={selectedCustomer.is_active ? "default" : "secondary"}>
                  {selectedCustomer.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Join Date</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm">
                    {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
