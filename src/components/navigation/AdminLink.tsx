
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
      className="flex items-center py-3 px-4 text-white hover:bg-anong-gold hover:text-anong-black transition-colors w-full font-serif"
    >
      <Shield className="mr-2 h-5 w-5" />
      <span>Admin Dashboard</span>
    </Link>
  );
};

export default AdminLink;
