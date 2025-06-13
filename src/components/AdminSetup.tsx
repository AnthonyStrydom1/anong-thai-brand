
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSetupFirstAdmin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to set up admin access.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('setup_first_admin');
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Admin role has been assigned successfully.",
      });
      
      // Refresh the page to update admin status
      window.location.reload();
    } catch (error) {
      console.error('Error setting up admin:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set up admin access.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignAdminToCurrentUser = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to assign admin access.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.rpc('assign_admin_role', {
        _user_id: user.id
      });
      
      if (error) throw error;

      toast({
        title: "Success!",
        description: "Admin role has been assigned to your account.",
      });
      
      // Refresh the page to update admin status
      window.location.reload();
    } catch (error) {
      console.error('Error assigning admin role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign admin role.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Admin Setup</span>
          </CardTitle>
          <CardDescription>
            Set up your first admin user to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Setup First Admin</span>
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                This will make the first registered user (oldest account) an admin.
              </p>
              <Button 
                onClick={handleSetupFirstAdmin}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? "Setting up..." : "Setup First Admin"}
              </Button>
            </div>

            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Make Current User Admin</span>
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                This will assign admin role to your current account.
              </p>
              <Button 
                onClick={handleAssignAdminToCurrentUser}
                disabled={isLoading || !user}
                className="w-full"
              >
                {isLoading ? "Assigning..." : "Make Me Admin"}
              </Button>
            </div>
          </div>

          {!user && (
            <div className="p-4 border rounded-lg bg-yellow-50">
              <p className="text-sm text-amber-700">
                You need to be logged in to set up admin access. Please sign in first.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
