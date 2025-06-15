
import React from 'react';
import { RefreshCw } from 'lucide-react';

const UsersListLoading = () => {
  return (
    <div className="text-center py-12">
      <RefreshCw className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
      <p className="text-gray-600 mb-2">Loading users...</p>
      <p className="text-sm text-gray-400">This may take a moment</p>
    </div>
  );
};

export default UsersListLoading;
