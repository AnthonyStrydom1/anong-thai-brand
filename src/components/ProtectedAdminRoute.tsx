
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: rolesLoading } = useUserRoles();

  console.log('🔐 ProtectedAdminRoute: Auth state check', { 
    user: !!user, 
    authLoading, 
    rolesLoading, 
    isAdminResult: user ? isAdmin() : false 
  });

  // Show loading state while checking authentication OR roles
  // This prevents the brief "Access Denied" flash
  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600">Checking admin access...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🚪 ProtectedAdminRoute: No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Show access denied if not admin (only after loading is complete)
  if (!isAdmin()) {
    console.log('❌ ProtectedAdminRoute: User is not admin, showing access denied');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need admin privileges to access this page.
            </p>
            <a 
              href="/admin-setup" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Admin Setup
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('✅ ProtectedAdminRoute: User is authenticated admin, allowing access');
  // Render protected content if user is authenticated and admin
  return <>{children}</>;
};

export default ProtectedAdminRoute;
