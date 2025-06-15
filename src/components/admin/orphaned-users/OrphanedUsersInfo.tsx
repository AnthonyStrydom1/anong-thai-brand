
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from 'lucide-react';

const OrphanedUsersInfo = () => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Info className="h-5 w-5" />
          Account Types & Data Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-blue-700 space-y-3">
        <div>
          <h4 className="font-semibold mb-1">Regular Customers (Shoppers)</h4>
          <p>• Created during normal signup process</p>
          <p>• Have records in: <strong>profiles</strong> + <strong>customers</strong> tables</p>
          <p>• Do NOT have records in: <strong>users</strong> table or <strong>user_roles</strong></p>
          <p>• Can shop, place orders, and manage their account</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-1">Admin Users (Staff)</h4>
          <p>• Created through admin panel or manual linking</p>
          <p>• Have records in: <strong>profiles</strong> + <strong>customers</strong> + <strong>users</strong> tables</p>
          <p>• Have roles in: <strong>user_roles</strong> table (admin, moderator, etc.)</p>
          <p>• Can access admin dashboard and manage the system</p>
        </div>

        <div className="bg-white p-3 rounded border border-blue-200">
          <h4 className="font-semibold mb-1">Linking Options</h4>
          <p><strong>"Link as Customer":</strong> Creates profile + customer records (normal shopper)</p>
          <p><strong>"Link as Admin":</strong> Creates profile + customer + users records + admin role</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrphanedUsersInfo;
