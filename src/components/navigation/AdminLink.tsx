
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const AdminLink = () => {
  const { user } = useAuth();

  // Simple admin check - in a real app you'd want to check user roles from your database
  // For now, we'll just check if the user is authenticated
  if (!user) {
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
