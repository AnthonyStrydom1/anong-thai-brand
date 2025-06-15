
import React from 'react';
import { RefreshCw } from 'lucide-react';

const UsersListLoading = () => {
  return (
    <div className="text-center py-8">
      <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
      <p className="text-gray-600">Loading users...</p>
    </div>
  );
};

export default UsersListLoading;
