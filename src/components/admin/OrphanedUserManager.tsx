
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
    fetchOrphanedUsers,
    linkUser,
    getOrphanedUsers
  } = useOrphanedUsers();

  const orphanedUsersList = getOrphanedUsers();

  const handleLinkUser = (userId: string, createProfile: boolean, createCustomer: boolean, createAdminRecord: boolean) => {
    linkUser(userId, createProfile, createCustomer, createAdminRecord);
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
                onLinkUser={handleLinkUser}
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
