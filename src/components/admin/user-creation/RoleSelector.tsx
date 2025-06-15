
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface RoleSelectorProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
  mode?: 'single' | 'multiple';
}

const RoleSelector = ({ selectedRoles, onRolesChange, mode = 'multiple' }: RoleSelectorProps) => {
  const availableRoles = [
    { value: 'user', label: 'User', description: 'Basic user access' },
    { value: 'moderator', label: 'Moderator', description: 'Can moderate content' },
    { value: 'admin', label: 'Admin', description: 'Full system access' }
  ];

  const handleRoleToggle = (role: string) => {
    if (mode === 'single') {
      onRolesChange([role]);
    } else {
      if (selectedRoles.includes(role)) {
        onRolesChange(selectedRoles.filter(r => r !== role));
      } else {
        onRolesChange([...selectedRoles, role]);
      }
    }
  };

  const handleSingleRoleChange = (role: string) => {
    onRolesChange([role]);
  };

  if (mode === 'single') {
    return (
      <div className="space-y-2">
        <Label>User Role *</Label>
        <Select onValueChange={handleSingleRoleChange} value={selectedRoles[0] || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{role.label}</span>
                  <span className="text-sm text-gray-500">{role.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

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
              key={role.value} 
              value={role.value}
              disabled={selectedRoles.includes(role.value)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{role.label}</span>
                <span className="text-sm text-gray-500">{role.description}</span>
              </div>
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
