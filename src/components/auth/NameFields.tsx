
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameFields = ({ firstName, lastName, isLoading, onChange }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>First Name</span>
        </Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="John"
          value={firstName}
          onChange={onChange}
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor="lastName" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>Last Name</span>
        </Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Doe"
          value={lastName}
          onChange={onChange}
          required
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default NameFields;
