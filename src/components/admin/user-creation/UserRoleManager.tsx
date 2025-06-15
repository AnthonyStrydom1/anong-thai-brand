
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, UserPlus, UserMinus } from 'lucide-react';

interface UserRole {
  id: string;
  role: string;
}

interface UserRoleManagerProps {
  userId: string;
  userEmail?: string;
  userRoles: UserRole[];
  onAddRole: (userId: string, role: string, userEmail?: string) => void;
  onRemoveRole: (userId: string, role: string, userEmail?: string) => void;
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
  const allRoles = ['user', 'moderator', 'admin'];
  const currentRoles = userRoles.map(r => r.role);
  const availableRoles = allRoles.filter(role => !currentRoles.includes(role));

  const handleAddRole = (role: string) => {
    onAddRole(userId, role, userEmail);
  };

  const handleRemoveRole = (role: string) => {
    onRemoveRole(userId, role, userEmail);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Current Roles */}
      <div className="flex gap-2">
        {currentRoles.length === 0 ? (
          <Badge variant="secondary">No roles</Badge>
        ) : (
          currentRoles.map((role) => (
            <div key={role} className="flex items-center gap-1">
              <Badge 
                variant={role === 'admin' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                {role}
                <UserMinus 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => handleRemoveRole(role)}
                />
              </Badge>
            </div>
          ))
        )}
      </div>
      
      {/* Add Role Dropdown */}
      {availableRoles.length > 0 && (
        <Select onValueChange={handleAddRole} disabled={isUpdating}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Add role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default UserRoleManager;
