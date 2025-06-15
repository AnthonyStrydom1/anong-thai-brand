
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, User, UserPlus, AlertCircle, RefreshCw, UserMinus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useUserRoles } from '@/hooks/useUserRoles';
import CreateUserForm from './user-creation/CreateUserForm';
import UserRoleManager from './user-creation/UserRoleManager';
import { useAdminUserDeletion } from './user-creation/useAdminUserDeletion';
import { useRoleManagement } from './user-creation/useRoleManagement';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  auth_user_id?: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface AllUser {
  id: string;
  email?: string;
  created_at: string;
  raw_user_meta_data?: any;
}

const UserManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [allUsers, setAllUsers] = useState<AllUser[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [viewMode, setViewMode] = useState<'admin' | 'all'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, isLoading: rolesLoading } = useUserRoles();
  const { deleteAdminUser, deletingUserId } = useAdminUserDeletion(() => {
    loadData();
  });
  const { addRole, removeRole, updatingUserId } = useRoleManagement(() => {
    loadUserRoles();
  });

  // Load data when component mounts and user is confirmed as admin
  useEffect(() => {
    if (!rolesLoading && isAdmin()) {
      console.log('UserManagement: Loading data on mount for admin user');
      loadData();
    }
  }, [rolesLoading, isAdmin]);

  // Load data when view mode changes
  useEffect(() => {
    if (!rolesLoading && isAdmin()) {
      console.log('UserManagement: Loading data due to view mode change:', viewMode);
      loadData();
    }
  }, [viewMode]);

  const loadData = () => {
    if (viewMode === 'admin') {
      loadAdminUsers();
    } else {
      loadAllUsers();
    }
    loadUserRoles();
  };

  const loadAdminUsers = async () => {
    try {
      setIsLoading(true);
      console.log('Loading admin users from users table...');
      
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) {
        console.error('Error loading admin users:', usersError);
        throw usersError;
      }
      
      console.log('Loaded admin users:', usersData);
      setAdminUsers(usersData || []);
      
    } catch (error: any) {
      console.error('Error loading admin users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load admin users.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      setIsLoading(true);
      console.log('Loading all users...');
      
      // Get all users from profiles table (represents all registered users)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error loading all users:', profilesError);
        throw profilesError;
      }
      
      console.log('Loaded all users:', profilesData);
      setAllUsers(profilesData || []);
      
    } catch (error: any) {
      console.error('Error loading all users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserRoles = async () => {
    try {
      console.log('Loading user roles...');
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) {
        console.error('Error loading user roles:', error);
        throw error;
      }
      
      console.log('Loaded user roles:', data);
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast({
        title: "Warning",
        description: "Failed to load user roles. Role information may be incomplete.",
        variant: "destructive"
      });
    }
  };

  const getUserRoles = (userId: string) => {
    return userRoles.filter(role => role.user_id === userId);
  };

  const currentUsers = viewMode === 'admin' ? adminUsers : allUsers;
  const filteredUsers = currentUsers.filter(user => {
    const searchTerm = searchEmail.toLowerCase();
    const email = user.email || '';
    const firstName = viewMode === 'admin' 
      ? (user as AdminUser).first_name || '' 
      : (user as AllUser).raw_user_meta_data?.first_name || '';
    const lastName = viewMode === 'admin' 
      ? (user as AdminUser).last_name || '' 
      : (user as AllUser).raw_user_meta_data?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
    
    return (
      email.toLowerCase().includes(searchTerm) ||
      firstName.toLowerCase().includes(searchTerm) ||
      lastName.toLowerCase().includes(searchTerm) ||
      fullName.includes(searchTerm)
    );
  });

  // Show loading while checking roles
  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user management...</p>
        </div>
      </div>
    );
  }

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

      {/* Create User Form */}
      <CreateUserForm onUserCreated={loadData} />

      {/* View Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>View Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'admin' ? 'default' : 'outline'}
              onClick={() => setViewMode('admin')}
            >
              Admin Users Only
            </Button>
            <Button 
              variant={viewMode === 'all' ? 'default' : 'outline'}
              onClick={() => setViewMode('all')}
            >
              All Users
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Users
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search-email">Search by Name or Email</Label>
              <Input
                id="search-email"
                type="text"
                placeholder="Enter name or email address..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={loadData}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === 'admin' ? 'Admin Users' : 'All Users'} ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 mb-2">
                {searchEmail ? "No users found matching your search." : "No users found."}
              </p>
              {!searchEmail && (
                <Button 
                  onClick={loadData}
                  variant="outline"
                  className="mt-2"
                >
                  Try Loading Again
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roles = getUserRoles(user.id);
                const email = user.email || 'No email';
                const firstName = viewMode === 'admin' 
                  ? (user as AdminUser).first_name 
                  : (user as AllUser).raw_user_meta_data?.first_name;
                const lastName = viewMode === 'admin' 
                  ? (user as AdminUser).last_name 
                  : (user as AllUser).raw_user_meta_data?.last_name;
                const displayName = firstName && lastName 
                  ? `${firstName} ${lastName}` 
                  : email;
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{displayName}</h3>
                          {email && displayName !== email && (
                            <p className="text-sm text-gray-500">{email}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <UserRoleManager
                        userId={user.id}
                        userEmail={email}
                        userRoles={roles}
                        onAddRole={addRole}
                        onRemoveRole={removeRole}
                        isUpdating={updatingUserId === user.id}
                      />
                      
                      {/* Delete Admin Button (only for admin users) */}
                      {viewMode === 'admin' && roles.some(r => r.role === 'admin') && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAdminUser(user.id, email)}
                          disabled={deletingUserId === user.id}
                          className="flex items-center gap-2"
                        >
                          <UserMinus className="w-4 h-4" />
                          {deletingUserId === user.id ? "Removing..." : "Remove"}
                        </Button>
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
              <p className="font-medium mb-1">User Management</p>
              <p>
                Use this interface to create new users and manage user roles. You can view admin users only or all registered users. 
                Users can have multiple roles (user, moderator, admin) and roles can be added or removed dynamically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
