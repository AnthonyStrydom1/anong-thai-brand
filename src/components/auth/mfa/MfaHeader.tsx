
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { mfaPasswordChangeService } from '@/services/mfa/mfaPasswordChangeService';

interface MfaHeaderProps {
  email: string;
}

const MfaHeader = ({ email }: MfaHeaderProps) => {
  // Check if this is a password change flow
  const isPasswordChange = mfaPasswordChangeService.getPendingEmail() === email;
  
  return (
    <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
        <Shield className="h-12 w-12 text-blue-600" />
      </div>
      <CardTitle className="text-2xl font-bold">
        {isPasswordChange ? 'Password Change Verification' : 'Two-Factor Authentication'}
      </CardTitle>
      <CardDescription>
        We've sent a 6-digit verification code to<br />
        <strong>{email}</strong>
        {isPasswordChange && (
          <><br /><span className="text-sm text-amber-600 mt-2 block">
            Please verify your identity to change your password
          </span></>
        )}
      </CardDescription>
    </CardHeader>
  );
};

export default MfaHeader;
