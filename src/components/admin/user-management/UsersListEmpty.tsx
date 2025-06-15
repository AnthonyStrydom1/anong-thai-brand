
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';

interface UsersListEmptyProps {
  onRefresh: () => void;
}

const UsersListEmpty = ({ onRefresh }: UsersListEmptyProps) => {
  return (
    <div className="text-center py-8">
      <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-gray-500 mb-2">No users found.</p>
      <Button 
        onClick={onRefresh}
        variant="outline"
        className="mt-2"
      >
        Try Loading Again
      </Button>
    </div>
  );
};

export default UsersListEmpty;
