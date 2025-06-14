
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

  // Don't show anything while loading, or if no user, or not admin
  if (isLoading || !user || !isAdmin()) {
    return null;
  }

  // Show admin dashboard link only for admins
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
};

export default AdminLink;
