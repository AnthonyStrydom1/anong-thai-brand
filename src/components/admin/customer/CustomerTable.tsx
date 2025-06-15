
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Phone } from "lucide-react";
import { SupabaseCustomer } from "@/services/supabaseService";

interface CustomerTableProps {
  customers: SupabaseCustomer[];
  onViewCustomer: (customer: SupabaseCustomer) => void;
  formatCurrency: (amount: number) => string;
}

const CustomerTable = ({ customers, onViewCustomer, formatCurrency }: CustomerTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>
              <div>
                <p className="font-medium">{customer.fullname}</p>
                <p className="text-sm text-gray-500">ID: {customer.id}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>{customer.total_orders || 0}</TableCell>
            <TableCell>{formatCurrency(customer.total_spent || 0)}</TableCell>
            <TableCell>
              {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell>
              <Badge variant={customer.is_active ? "default" : "secondary"}>
                {customer.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewCustomer(customer)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomerTable;
