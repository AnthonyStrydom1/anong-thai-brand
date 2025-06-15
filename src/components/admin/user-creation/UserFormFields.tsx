
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface UserFormData {
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
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          placeholder="Enter email address"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onInputChange('password', e.target.value)}
          placeholder="Enter password"
          required
          minLength={6}
        />
        <p className="text-sm text-gray-500 mt-1">
          Password must be at least 6 characters long
        </p>
      </div>
    </>
  );
};

export default UserFormFields;
