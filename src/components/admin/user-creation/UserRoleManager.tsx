
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Minus } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface UserRoleManagerProps {
  userId: string;
  userEmail: string;
  userRoles: UserRole[];
  onAddRole: (userId: string, role: string, userEmail: string) => void;
  onRemoveRole: (userId: string, role: string, userEmail: string) => void;
  isUpdating: boolean;
}

const UserRoleManager = ({
  userId,
  userEmail,
  userRoles,
  onAddRole,
  onRemoveRole,
  isUpdating
}: UserRoleManagerProps) => {
  const availableRoles = ['admin', 'moderator', 'user'];
  const currentRoles = userRoles.map(r => r.role);
  const availableToAdd = availableRoles.filter(role => !currentRoles.includes(role));

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive' as const;
      case 'moderator': return 'secondary' as const;
      case 'user': return 'default' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Current Roles */}
      <div className="flex flex-wrap gap-1">
        {userRoles.map((userRole) => (
          <div key={userRole.id} className="flex items-center gap-1">
            <Badge variant={getRoleBadgeVariant(userRole.role)}>
              {userRole.role}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveRole(userId, userRole.role, userEmail)}
              disabled={isUpdating}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <Minus className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Role Dropdown */}
      {availableToAdd.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isUpdating}
              className="h-7"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Role
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableToAdd.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => onAddRole(userId, role, userEmail)}
              >
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserRoleManager;
