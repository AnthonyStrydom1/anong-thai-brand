
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import type { OrphanedUser } from './types';

interface OrphanedUsersStatsProps {
  totalUsers: number;
  orphanedUsers: OrphanedUser[];
}

const OrphanedUsersStats = ({ totalUsers, orphanedUsers }: OrphanedUsersStatsProps) => {
  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Total auth users: {totalUsers} | 
        Orphaned users: {orphanedUsers.length} | 
        Properly linked: {totalUsers - orphanedUsers.length}
      </AlertDescription>
    </Alert>
  );
};

export default OrphanedUsersStats;
