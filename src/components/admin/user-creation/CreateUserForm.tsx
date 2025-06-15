
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import UserFormFields from './UserFormFields';
import { useAdminUserCreation } from './useAdminUserCreation';
import type { UserFormData } from './UserFormFields';

interface CreateUserFormProps {
  onUserCreated: () => void;
}

const CreateUserForm = ({ onUserCreated }: CreateUserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const { createAdminUser, isCreating } = useAdminUserCreation(() => {
    setFormData({ email: '', password: '', firstName: '', lastName: '' });
    onUserCreated();
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    createAdminUser(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create New Admin User
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <UserFormFields formData={formData} onInputChange={handleInputChange} />
        
        <Button 
          onClick={handleSubmit}
          disabled={isCreating || !formData.email || !formData.password}
          className="w-full"
        >
          {isCreating ? "Creating..." : "Create Admin User"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateUserForm;
