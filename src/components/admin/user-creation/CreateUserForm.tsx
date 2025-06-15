
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import UserFormFields, { UserFormData } from './UserFormFields';
import RoleSelector from './RoleSelector';
import { useUserCreation } from './useUserCreation';

interface CreateUserFormProps {
  onUserCreated: () => void;
}

const CreateUserForm = ({ onUserCreated }: CreateUserFormProps) => {
  const [formData, setFormData] = useState<UserFormData & { roles: string[] }>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roles: ['user'] // Default to user role
  });

  const { createUser, isCreating } = useUserCreation(() => {
    setFormData({ 
      email: '', 
      password: '', 
      firstName: '', 
      lastName: '', 
      roles: ['user'] 
    });
    onUserCreated();
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRolesChange = (roles: string[]) => {
    setFormData(prev => ({ ...prev, roles }));
  };

  const handleSubmit = () => {
    createUser(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New User
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UserFormFields formData={formData} onInputChange={handleInputChange} />
        
        <RoleSelector 
          selectedRoles={formData.roles}
          onRolesChange={handleRolesChange}
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={isCreating || !formData.email || !formData.password || formData.roles.length === 0}
          className="w-full"
        >
          {isCreating ? "Creating..." : "Create User"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateUserForm;
