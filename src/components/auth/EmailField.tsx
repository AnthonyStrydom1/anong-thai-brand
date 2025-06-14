
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailFieldProps {
  email: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailField = ({ email, isLoading, onChange }: EmailFieldProps) => {
  return (
    <div>
      <Label htmlFor="email" className="flex items-center space-x-2">
        <Mail className="w-4 h-4" />
        <span>Email</span>
      </Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="john@example.com"
        value={email}
        onChange={onChange}
        required
        disabled={isLoading}
      />
    </div>
  );
};

export default EmailField;
