
import React from 'react';
import { useOrphanedUsers } from './orphaned-users/useOrphanedUsers';
import OrphanedUsersHeader from './orphaned-users/OrphanedUsersHeader';
import OrphanedUsersStats from './orphaned-users/OrphanedUsersStats';
import OrphanedUsersLoading from './orphaned-users/OrphanedUsersLoading';
import OrphanedUsersEmptyState from './orphaned-users/OrphanedUsersEmptyState';
import OrphanedUserCard from './orphaned-users/OrphanedUserCard';
import OrphanedUsersInfo from './orphaned-users/OrphanedUsersInfo';

const OrphanedUserManager = () => {
  const {
    orphanedUsers,
    isLoading,
    isLinking,
    isRemoving,
    fetchOrphanedUsers,
    linkUser,
    removeUser,
    getOrphanedUsers
  } = useOrphanedUsers();

  const orphanedUsersList = getOrphanedUsers();

  const handleLinkUser = (userId: string, createProfile: boolean, createCustomer: boolean, createAdminRecord: boolean) => {
    linkUser(userId, createProfile, createCustomer, createAdminRecord);
  };

  const handleRemoveUser = (userId: string, userEmail: string) => {
    if (confirm(`Are you sure you want to permanently remove user ${userEmail}? This action cannot be undone.`)) {
      removeUser(userId, userEmail);
    }
  };

  return (
    <div className="space-y-6">
      <OrphanedUsersHeader 
        onRefresh={fetchOrphanedUsers} 
        isLoading={isLoading} 
      />

      <OrphanedUsersStats 
        totalUsers={orphanedUsers.length}
        orphanedUsers={orphanedUsersList}
      />

      {isLoading ? (
        <OrphanedUsersLoading />
      ) : (
        <div className="space-y-4">
          {orphanedUsersList.length === 0 ? (
            <OrphanedUsersEmptyState />
          ) : (
            orphanedUsersList.map((user) => (
              <OrphanedUserCard
                key={user.id}
                user={user}
                isLinking={isLinking === user.id}
                isRemoving={isRemoving === user.id}
                onLinkUser={handleLinkUser}
                onRemoveUser={handleRemoveUser}
              />
            ))
          )}
        </div>
      )}

      <OrphanedUsersInfo />
    </div>
  );
};

export default OrphanedUserManager;
