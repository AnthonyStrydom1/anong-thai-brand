
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import UserCard from './UserCard';
import UsersListHeader from './UsersListHeader';
import UsersListEmpty from './UsersListEmpty';
import UsersListLoading from './UsersListLoading';

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
      <UsersListHeader viewMode={viewMode} userCount={filteredUsers.length} />
      <CardContent>
        {isLoading ? (
          <UsersListLoading />
        ) : filteredUsers.length === 0 ? (
          <UsersListEmpty onRefresh={onRefresh} />
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                viewMode={viewMode}
                userRoles={getUserRoles(user.id)}
                onAddRole={onAddRole}
                onRemoveRole={onRemoveRole}
                onDeleteAdminUser={onDeleteAdminUser}
                updatingUserId={updatingUserId}
                deletingUserId={deletingUserId}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersList;
