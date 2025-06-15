
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { mfaPasswordChangeService } from '@/services/mfa/mfaPasswordChangeService';
import MfaHeader from './mfa/MfaHeader';
import MfaCodeInput from './mfa/MfaCodeInput';
import MfaStatus from './mfa/MfaStatus';

interface PasswordChangeMfaProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordChangeMfa = ({ email, onSuccess, onCancel }: PasswordChangeMfaProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Show email confirmation for first few seconds
  useEffect(() => {
    setIsEmailConfirmed(true);
    const timer = setTimeout(() => setIsEmailConfirmed(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyAndChangePassword = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    if (!newPassword) {
      toast({
        title: "Password Required",
        description: "Please enter your new password.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setHasError(false);
    
    try {
      console.log('🔍 PasswordChangeMfa: Attempting verification and password change');
      await mfaPasswordChangeService.verifyAndChangePassword(fullCode, newPassword);
      
      toast({
        title: "Password Changed Successfully!",
        description: "Your password has been updated.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('❌ PasswordChangeMfa: Verification/change error:', error);
      setHasError(true);
      toast({
        title: "Password Change Failed",
        description: error.message || "Invalid verification code or password change failed.",
        variant: "destructive"
      });
      setCode(['', '', '', '', '', '']);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setHasError(false);
    
    try {
      console.log('🔄 PasswordChangeMfa: Resending verification code');
      await mfaPasswordChangeService.resendCode();
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setIsEmailConfirmed(true);
      setTimeout(() => setIsEmailConfirmed(false), 3000);
    } catch (error: any) {
      console.error('❌ PasswordChangeMfa: Resend error:', error);
      setHasError(true);
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend verification code.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    if (!/^\d*$/.test(value)) return; // Only allow digits
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setHasError(false); // Clear error when user starts typing
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <MfaHeader email={email} />
      <CardContent className="space-y-6">
        <MfaStatus 
          isEmailConfirmed={isEmailConfirmed}
          hasError={hasError}
        />

        <div className="space-y-4">
          <MfaCodeInput
            code={code}
            isVerifying={isVerifying}
            onCodeChange={handleCodeChange}
            onKeyDown={handleKeyDown}
          />

          {/* New Password Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isVerifying}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isVerifying}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button 
              onClick={handleVerifyAndChangePassword}
              disabled={code.join('').length !== 6 || !newPassword || !confirmPassword || isVerifying}
              className="w-full"
            >
              {isVerifying ? "Changing Password..." : "Verify & Change Password"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Code expires in {formatTime(timeLeft)}
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResend}
                  disabled={!canResend || isResending || timeLeft > 240}
                >
                  {isResending ? 'Resending...' : 'Resend Code'}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeMfa;
