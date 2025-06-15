
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';

const UserManagementInfo = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">User Management</p>
            <p>
              Use this interface to create new users and manage user roles. You can view admin users only or all registered users. 
              Users can have multiple roles (user, moderator, admin) and roles can be added or removed dynamically.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementInfo;
