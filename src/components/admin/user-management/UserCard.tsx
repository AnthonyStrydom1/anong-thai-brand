
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, UserMinus } from 'lucide-react';
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
  role: string;
}

interface UserCardProps {
  user: AdminUser | AllUser;
  viewMode: 'admin' | 'all';
  userRoles: UserRole[];
  onAddRole: (userId: string, role: string, userEmail?: string) => void;
  onRemoveRole: (userId: string, role: string, userEmail?: string) => void;
  onDeleteAdminUser: (userId: string, userEmail: string) => void;
  updatingUserId: string | null;
  deletingUserId: string | null;
}

const UserCard = ({
  user,
  viewMode,
  userRoles,
  onAddRole,
  onRemoveRole,
  onDeleteAdminUser,
  updatingUserId,
  deletingUserId
}: UserCardProps) => {
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
    <div className="flex items-center justify-between p-4 border rounded-lg">
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
          userRoles={userRoles}
          onAddRole={onAddRole}
          onRemoveRole={onRemoveRole}
          isUpdating={updatingUserId === user.id}
        />
        
        {/* Delete Admin Button (only for admin users) */}
        {viewMode === 'admin' && userRoles.some(r => r.role === 'admin') && (
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
};

export default UserCard;
