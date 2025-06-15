
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const OrphanedUsersLoading = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading auth users...</p>
      </CardContent>
    </Card>
  );
};

export default OrphanedUsersLoading;
