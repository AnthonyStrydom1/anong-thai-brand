
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrphanedUsersInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">What this tool does</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600">
        <p><strong>Regular User Linking:</strong> Creates profile and customer records, assigns 'user' role</p>
        <p><strong>Admin User Linking:</strong> Creates profile, customer, and admin user records, assigns 'user' role</p>
        <p><strong>Orphaned Users:</strong> Auth users missing profile, customer records, or roles</p>
        <p><strong>Note:</strong> Admin roles must be assigned separately through the role management system</p>
      </CardContent>
    </Card>
  );
};

export default OrphanedUsersInfo;
