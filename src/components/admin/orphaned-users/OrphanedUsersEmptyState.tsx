
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from 'lucide-react';

const OrphanedUsersEmptyState = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <UserCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
        <h3 className="text-lg font-semibold mb-2">All Users Properly Linked</h3>
        <p className="text-gray-600">
          All auth users are properly connected to your public tables.
        </p>
      </CardContent>
    </Card>
  );
};

export default OrphanedUsersEmptyState;
