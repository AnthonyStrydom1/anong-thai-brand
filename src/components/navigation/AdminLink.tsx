
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';

const AdminLink = () => {
  const { isAdmin, isLoading } = useUserRoles();

  // Don't show anything while loading or if user is not admin
  if (isLoading || !isAdmin()) {
    return null;
  }

  return (
    <Link
      to="/admin"
      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    >
      <Settings className="w-4 h-4" />
      <span>Admin Portal</span>
    </Link>
  );
};

export default AdminLink;
