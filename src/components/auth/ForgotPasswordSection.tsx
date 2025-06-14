
import React from 'react';
import { Button } from '@/components/ui/button';

interface ForgotPasswordSectionProps {
  isLoading: boolean;
  onForgotPassword: () => void;
}

const ForgotPasswordSection = ({ isLoading, onForgotPassword }: ForgotPasswordSectionProps) => {
  return (
    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
      <p className="text-sm text-blue-800 mb-2">
        Forgot your password? We can help you reset it.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onForgotPassword}
        disabled={isLoading}
        className="w-full"
      >
        Send Reset Email
      </Button>
    </div>
  );
};

export default ForgotPasswordSection;
