
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock } from 'lucide-react';

interface UserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserFormFieldsProps {
  formData: UserFormData;
  onInputChange: (field: string, value: string) => void;
}

const UserFormFields = ({ formData, onInputChange }: UserFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Strong password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
    </>
  );
};

export default UserFormFields;
export type { UserFormData };
