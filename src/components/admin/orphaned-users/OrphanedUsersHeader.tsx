
import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, RefreshCw } from 'lucide-react';

interface OrphanedUsersHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const OrphanedUsersHeader = ({ onRefresh, isLoading }: OrphanedUsersHeaderProps) => {
  return (
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
      <Button onClick={onRefresh} disabled={isLoading}>
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
};

export default OrphanedUsersHeader;
