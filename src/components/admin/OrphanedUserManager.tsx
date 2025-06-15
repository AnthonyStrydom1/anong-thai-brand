
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Users, UserCheck, AlertTriangle, RefreshCw } from 'lucide-react';

interface OrphanedUser {
  id: string;
  email: string;
  created_at: string;
  raw_user_meta_data: any;
  has_profile: boolean;
  has_customer: boolean;
  has_user_record: boolean;
  user_roles: string[];
}

interface LinkUserResponse {
  success: boolean;
  actions?: Array<{ action: string }>;
  error?: string;
}

const OrphanedUserManager = () => {
  const [orphanedUsers, setOrphanedUsers] = useState<OrphanedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState<string | null>(null);

  const fetchOrphanedUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('find_orphaned_auth_users');
      
      if (error) {
        console.error('Error fetching orphaned users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orphaned users: " + error.message,
          variant: "destructive"
        });
        return;
      }

      setOrphanedUsers(data || []);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching users.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrphanedUsers();
  }, []);

  const linkUser = async (
    userId: string, 
    createProfile: boolean = true, 
    createCustomer: boolean = true, 
    createAdminRecord: boolean = false
  ) => {
    try {
      setIsLinking(userId);
      
      const { data, error } = await supabase.rpc('link_orphaned_user', {
        _user_id: userId,
        _create_profile: createProfile,
        _create_customer: createCustomer,
        _create_admin_record: createAdminRecord
      });

      if (error) {
        console.error('Error linking user:', error);
        toast({
          title: "Error",
          description: "Failed to link user: " + error.message,
          variant: "destructive"
        });
        return;
      }

      // Safely handle the response by checking if it's an object and has the expected properties
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const response = data as Record<string, any>;
        
        if (response.success) {
          const actions = response.actions || [];
          const actionMessages = Array.isArray(actions) 
            ? actions.map((action: any) => action.action).join(', ')
            : 'User linked';
          
          toast({
            title: "Success!",
            description: `User linked successfully. Actions: ${actionMessages}`,
          });
          
          // Refresh the list
          await fetchOrphanedUsers();
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to link user",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Unexpected response format from server",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while linking user.",
        variant: "destructive"
      });
    } finally {
      setIsLinking(null);
    }
  };

  const getOrphanedUsers = () => {
    return orphanedUsers.filter(user => 
      !user.has_profile || !user.has_customer || user.user_roles.length === 0
    );
  };

  const orphanedUsersList = getOrphanedUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Orphaned User Management
          </h2>
          <p className="text-gray-600 mt-1">
            Find and link auth users that aren't properly connected to your public tables
          </p>
        </div>
        <Button onClick={fetchOrphanedUsers} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Total auth users: {orphanedUsers.length} | 
          Orphaned users: {orphanedUsersList.length} | 
          Properly linked: {orphanedUsers.length - orphanedUsersList.length}
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading auth users...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orphanedUsersList.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <UserCheck className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">All Users Properly Linked</h3>
                <p className="text-gray-600">
                  All auth users are properly connected to your public tables.
                </p>
              </CardContent>
            </Card>
          ) : (
            orphanedUsersList.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{user.email}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={user.has_profile ? "default" : "destructive"}>
                        Profile: {user.has_profile ? "✓" : "✗"}
                      </Badge>
                      <Badge variant={user.has_customer ? "default" : "destructive"}>
                        Customer: {user.has_customer ? "✓" : "✗"}
                      </Badge>
                      <Badge variant={user.user_roles.length > 0 ? "default" : "destructive"}>
                        Roles: {user.user_roles.length > 0 ? user.user_roles.join(", ") : "None"}
                      </Badge>
                      <Badge variant={user.has_user_record ? "default" : "secondary"}>
                        Admin Record: {user.has_user_record ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p><strong>Name:</strong> {user.raw_user_meta_data?.first_name || 'N/A'} {user.raw_user_meta_data?.last_name || 'N/A'}</p>
                      <p><strong>User ID:</strong> {user.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => linkUser(user.id, true, true, false)}
                        disabled={isLinking === user.id}
                        size="sm"
                      >
                        {isLinking === user.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Linking...
                          </>
                        ) : (
                          'Link as Regular User'
                        )}
                      </Button>
                      <Button
                        onClick={() => linkUser(user.id, true, true, true)}
                        disabled={isLinking === user.id}
                        variant="outline"
                        size="sm"
                      >
                        Link as Admin User
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What this tool does</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p><strong>Regular User Linking:</strong> Creates profile and customer records, assigns 'user' role</p>
          <p><strong>Admin User Linking:</strong> Creates profile, customer, and admin user records, assigns 'user' role</p>
          <p><strong>Orphaned Users:</strong> Auth users missing profile, customer records, or roles</p>
          <p><strong>Note:</strong> Admin roles must be assigned separately through the role management system</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrphanedUserManager;
