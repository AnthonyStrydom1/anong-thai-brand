
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, User, UserPlus, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUserRoles } from '@/hooks/useUserRoles';

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  first_name?: string;
  last_name?: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);
  const { isAdmin } = useUserRoles();

  // Load users from profiles table instead of auth.users
  useEffect(() => {
    if (isAdmin()) {
      loadUsers();
      loadUserRoles();
    }
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      // Get users from profiles table which should be accessible to admins
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Make sure you have admin privileges.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) throw error;
      
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  };

  const assignAdminRole = async (userId: string, userEmail: string | undefined) => {
    if (!userId) return;
    
    setAssigningUserId(userId);
    try {
      const { error } = await supabase.rpc('assign_admin_role', {
        _user_id: userId
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: `Admin role assigned to ${userEmail || 'user'}`,
      });
      
      // Reload user roles to reflect changes
      await loadUserRoles();
    } catch (error) {
      console.error('Error assigning admin role:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign admin role.",
        variant: "destructive"
      });
    } finally {
      setAssigningUserId(null);
    }
  };

  const getUserRoles = (userId: string) => {
    return userRoles.filter(role => role.user_id === userId);
  };

  const hasAdminRole = (userId: string) => {
    return getUserRoles(userId).some(role => role.role === 'admin');
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchEmail.toLowerCase()) || false
  );

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to manage users.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="h-6 w-6" />
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Users
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search-email">Search by Email</Label>
              <Input
                id="search-email"
                type="email"
                placeholder="Enter email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={loadUsers}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {searchEmail ? "No users found matching your search." : "No users found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roles = getUserRoles(user.id);
                const isUserAdmin = hasAdminRole(user.id);
                const displayName = user.first_name && user.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user.email;
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{displayName || 'No email'}</h3>
                          {user.email && displayName !== user.email && (
                            <p className="text-sm text-gray-500">{user.email}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                          {user.last_sign_in_at && (
                            <p className="text-sm text-gray-500">
                              Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Role Badges */}
                      <div className="flex gap-2">
                        {roles.length === 0 ? (
                          <Badge variant="secondary">user</Badge>
                        ) : (
                          roles.map((role) => (
                            <Badge 
                              key={role.id}
                              variant={role.role === 'admin' ? 'default' : 'secondary'}
                            >
                              {role.role}
                            </Badge>
                          ))
                        )}
                      </div>
                      
                      {/* Admin Assignment Button */}
                      {!isUserAdmin && (
                        <Button
                          size="sm"
                          onClick={() => assignAdminRole(user.id, user.email)}
                          disabled={assigningUserId === user.id}
                          className="flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          {assigningUserId === user.id ? "Assigning..." : "Make Admin"}
                        </Button>
                      )}
                      
                      {isUserAdmin && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm font-medium">Admin</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Admin Role Assignment</p>
              <p>
                Only existing admins can assign admin roles to other users. 
                Users must have registered accounts before they can be assigned roles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
