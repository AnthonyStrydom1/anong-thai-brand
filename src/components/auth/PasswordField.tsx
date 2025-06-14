
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
}

const PasswordField = ({ 
  password, 
  showPassword, 
  isLoading, 
  onChange, 
  onTogglePassword 
}: PasswordFieldProps) => {
  return (
    <div>
      <Label htmlFor="password" className="flex items-center space-x-2">
        <Lock className="w-4 h-4" />
        <span>Password</span>
      </Label>
      <div className="relative">
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={onChange}
          required
          disabled={isLoading}
          minLength={6}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={onTogglePassword}
          disabled={isLoading}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default PasswordField;
