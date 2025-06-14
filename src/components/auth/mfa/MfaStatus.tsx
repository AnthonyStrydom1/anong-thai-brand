
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface MfaStatusProps {
  isEmailConfirmed: boolean;
  hasError: boolean;
}

const MfaStatus = ({ isEmailConfirmed, hasError }: MfaStatusProps) => {
  return (
    <div className="space-y-4">
      {isEmailConfirmed && (
        <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800">
            Verification code sent successfully!
          </p>
        </div>
      )}

      {hasError && (
        <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-800 font-medium">
              Having trouble receiving the code?
            </p>
            <p className="text-xs text-red-700 mt-1">
              Check your spam folder or try resending the code.
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Check your email:</strong> The verification code has been sent to your email address. 
          If you don't see it, check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default MfaStatus;
