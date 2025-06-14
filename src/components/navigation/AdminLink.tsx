
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';

const AdminLink = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useUserRoles();

  console.log('🔍 AdminLink: Debug info', { 
    hasUser: !!user, 
    isLoading, 
    isAdminResult: isAdmin(),
    userId: user?.id 
  });

  // Don't show anything while loading or if user is not authenticated
  if (isLoading || !user) {
    return null;
  }

  // Show admin dashboard link if user is admin
  if (isAdmin()) {
    console.log('✅ AdminLink: Showing admin dashboard link');
    return (
      <Link 
        to="/admin" 
        className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors w-full"
      >
        <Shield className="w-4 h-4" />
        <span>Admin Dashboard</span>
      </Link>
    );
  }

  // Show admin setup link if user exists but is not admin
  console.log('ℹ️ AdminLink: Showing admin setup link');
  return (
    <Link 
      to="/admin-setup" 
      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors w-full"
    >
      <Shield className="w-4 h-4" />
      <span>Admin Setup</span>
    </Link>
  );
};

export default AdminLink;
