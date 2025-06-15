
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, RefreshCw, UserMinus } from 'lucide-react';
import UserRoleManager from '../user-creation/UserRoleManager';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  auth_user_id?: string;
}

interface AllUser {
  id: string;
  email?: string;
  created_at: string;
  raw_user_meta_data?: any;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface UsersListProps {
  viewMode: 'admin' | 'all';
  filteredUsers: (AdminUser | AllUser)[];
  userRoles: UserRole[];
  isLoading: boolean;
  onRefresh: () => void;
  onAddRole: (userId: string, role: string, userEmail?: string) => void;
  onRemoveRole: (userId: string, role: string, userEmail?: string) => void;
  onDeleteAdminUser: (userId: string, userEmail: string) => void;
  updatingUserId: string | null;
  deletingUserId: string | null;
}

const UsersList = ({
  viewMode,
  filteredUsers,
  userRoles,
  isLoading,
  onRefresh,
  onAddRole,
  onRemoveRole,
  onDeleteAdminUser,
  updatingUserId,
  deletingUserId
}: UsersListProps) => {
  const getUserRoles = (userId: string) => {
    return userRoles.filter(role => role.user_id === userId);
  };

  return (
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
            <p className="text-gray-500 mb-2">No users found.</p>
            <Button 
              onClick={onRefresh}
              variant="outline"
              className="mt-2"
            >
              Try Loading Again
            </Button>
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
                      onAddRole={onAddRole}
                      onRemoveRole={onRemoveRole}
                      isUpdating={updatingUserId === user.id}
                    />
                    
                    {/* Delete Admin Button (only for admin users) */}
                    {viewMode === 'admin' && roles.some(r => r.role === 'admin') && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteAdminUser(user.id, email)}
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
  );
};

export default UsersList;
