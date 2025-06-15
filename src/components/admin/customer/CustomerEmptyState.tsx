
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CustomerEmptyStateProps {
  searchTerm: string;
}

const CustomerEmptyState = ({ searchTerm }: CustomerEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Users className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Customers Found</h3>
        <p className="text-gray-500 text-center">
          {searchTerm ? 'No customers match your search criteria.' : 'No customers have registered yet.'}
        </p>
      </CardContent>
    </Card>
  );
};

export default CustomerEmptyState;
