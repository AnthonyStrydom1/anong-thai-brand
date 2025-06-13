
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/hooks/useAuth';

const AdminLink = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useUserRoles();

  // Don't show anything while loading or if user is not authenticated
  if (isLoading || !user) {
    return null;
  }

  // Show admin setup link if user exists but is not admin
  if (!isAdmin()) {
    return (
      <Link 
        to="/admin-setup" 
        className="flex items-center space-x-1 text-white hover:text-anong-gold transition-colors"
      >
        <Shield className="w-4 h-4" />
        <span>Admin Setup</span>
      </Link>
    );
  }

  // Show admin dashboard link if user is admin
  return (
    <Link 
      to="/admin" 
      className="flex items-center space-x-1 text-white hover:text-anong-gold transition-colors"
    >
      <Shield className="w-4 h-4" />
      <span>Admin</span>
    </Link>
  );
};

export default AdminLink;
