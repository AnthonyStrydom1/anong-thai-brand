
import React from 'react';
import { UserPlus } from 'lucide-react';

const UserManagementHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <UserPlus className="h-6 w-6" />
      <h1 className="text-2xl font-bold">User Management</h1>
    </div>
  );
};

export default UserManagementHeader;
