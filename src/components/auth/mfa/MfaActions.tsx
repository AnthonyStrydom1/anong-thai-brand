
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface MfaActionsProps {
  code: string[];
  isVerifying: boolean;
  isResending: boolean;
  canResend: boolean;
  timeLeft: number;
  onVerify: () => void;
  onResend: () => void;
  onCancel: () => void;
}

const MfaActions = ({
  code,
  isVerifying,
  isResending,
  canResend,
  timeLeft,
  onVerify,
  onResend,
  onCancel
}: MfaActionsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={onVerify}
        disabled={code.join('').length !== 6 || isVerifying}
        className="w-full"
      >
        {isVerifying ? "Verifying..." : "Verify Code"}
      </Button>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Code expires in {formatTime(timeLeft)}
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onResend}
            disabled={!canResend || isResending || timeLeft > 240}
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              'Resend Code'
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isVerifying}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MfaActions;
