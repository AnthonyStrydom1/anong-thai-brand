
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface RoleSelectorProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
}

const RoleSelector = ({ selectedRoles, onRolesChange }: RoleSelectorProps) => {
  const availableRoles = ['user', 'moderator', 'admin'];

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      onRolesChange(selectedRoles.filter(r => r !== role));
    } else {
      onRolesChange([...selectedRoles, role]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>User Roles</Label>
      <Select onValueChange={handleRoleToggle}>
        <SelectTrigger>
          <SelectValue placeholder="Select roles to assign" />
        </SelectTrigger>
        <SelectContent>
          {availableRoles.map((role) => (
            <SelectItem 
              key={role} 
              value={role}
              disabled={selectedRoles.includes(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedRoles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedRoles.map((role) => (
            <Badge 
              key={role} 
              variant={role === 'admin' ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => handleRoleToggle(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
