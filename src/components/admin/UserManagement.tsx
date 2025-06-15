
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { useUserRoles } from '@/hooks/useUserRoles';
import CreateUserForm from './user-creation/CreateUserForm';
import { useAdminUserDeletion } from './user-creation/useAdminUserDeletion';
import { useRoleManagement } from './user-creation/useRoleManagement';
import { useUserManagement } from './user-management/useUserManagement';
import UserManagementHeader from './user-management/UserManagementHeader';
import ViewModeToggle from './user-management/ViewModeToggle';
import UserSearchSection from './user-management/UserSearchSection';
import UsersList from './user-management/UsersList';
import UserManagementInfo from './user-management/UserManagementInfo';

const UserManagement = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [viewMode, setViewMode] = useState<'admin' | 'all'>('admin');
  const { isAdmin, isLoading: rolesLoading } = useUserRoles();
  
  const {
    adminUsers,
    allUsers,
    userRoles,
    isLoading,
    loadData,
    loadUserRoles
  } = useUserManagement();

  const { deleteAdminUser, deletingUserId } = useAdminUserDeletion(() => {
    loadData(viewMode);
  });
  
  const { addRole, removeRole, updatingUserId } = useRoleManagement(() => {
    loadUserRoles();
  });

  // Load data when component mounts and user is confirmed as admin
  useEffect(() => {
    if (!rolesLoading && isAdmin()) {
      console.log('UserManagement: User is admin, loading initial data');
      loadData(viewMode);
    }
  }, [rolesLoading, isAdmin()]);

  // Load data when view mode changes (but only if not loading roles)
  useEffect(() => {
    if (!rolesLoading && isAdmin() && !isLoading) {
      console.log('UserManagement: View mode changed to:', viewMode);
      loadData(viewMode);
    }
  }, [viewMode]);

  const currentUsers = viewMode === 'admin' ? adminUsers : allUsers;
  const filteredUsers = currentUsers.filter(user => {
    if (!searchEmail) return true;
    
    const searchTerm = searchEmail.toLowerCase();
    const email = user.email || '';
    const firstName = viewMode === 'admin' 
      ? (user as any).first_name || '' 
      : (user as any).raw_user_meta_data?.first_name || '';
    const lastName = viewMode === 'admin' 
      ? (user as any).last_name || '' 
      : (user as any).raw_user_meta_data?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim().toLowerCase();
    
    return (
      email.toLowerCase().includes(searchTerm) ||
      firstName.toLowerCase().includes(searchTerm) ||
      lastName.toLowerCase().includes(searchTerm) ||
      fullName.includes(searchTerm)
    );
  });

  const handleRefresh = () => {
    if (!isLoading) {
      loadData(viewMode);
    }
  };

  // Show loading while checking roles
  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
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
      <UserManagementHeader />

      {/* Create User Form */}
      <CreateUserForm onUserCreated={() => loadData(viewMode)} />

      {/* View Mode Toggle */}
      <ViewModeToggle 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />

      {/* Search Section */}
      <UserSearchSection
        searchEmail={searchEmail}
        onSearchChange={setSearchEmail}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Users List */}
      <UsersList
        viewMode={viewMode}
        filteredUsers={filteredUsers}
        userRoles={userRoles}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onAddRole={addRole}
        onRemoveRole={removeRole}
        onDeleteAdminUser={deleteAdminUser}
        updatingUserId={updatingUserId}
        deletingUserId={deletingUserId}
      />

      {/* Info Card */}
      <UserManagementInfo />
    </div>
  );
};

export default UserManagement;
