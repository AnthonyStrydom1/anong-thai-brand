
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";

interface UsersListHeaderProps {
  viewMode: 'admin' | 'all';
  userCount: number;
}

const UsersListHeader = ({ viewMode, userCount }: UsersListHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle>
        {viewMode === 'admin' ? 'Admin Users' : 'All Users'} ({userCount})
      </CardTitle>
    </CardHeader>
  );
};

export default UsersListHeader;
