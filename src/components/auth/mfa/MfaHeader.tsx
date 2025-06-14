
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface MfaHeaderProps {
  email: string;
}

const MfaHeader = ({ email }: MfaHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <Shield className="h-12 w-12 text-blue-600" />
      </div>
      <CardTitle className="text-2xl font-bold">
        Two-Factor Authentication
      </CardTitle>
      <CardDescription>
        We've sent a 6-digit verification code to<br />
        <strong>{email}</strong>
      </CardDescription>
    </CardHeader>
  );
};

export default MfaHeader;
