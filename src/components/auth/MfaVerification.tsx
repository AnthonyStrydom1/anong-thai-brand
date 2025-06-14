
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { mfaAuthService } from '@/services/mfaAuthService';
import MfaHeader from './mfa/MfaHeader';
import MfaCodeInput from './mfa/MfaCodeInput';
import MfaActions from './mfa/MfaActions';
import MfaStatus from './mfa/MfaStatus';

interface MfaVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MfaVerification = ({ email, onSuccess, onCancel }: MfaVerificationProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
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

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    setHasError(false);
    
    try {
      console.log('🔍 MfaVerification: Attempting verification with code:', fullCode);
      await mfaAuthService.verifyAndSignIn(fullCode);
      
      toast({
        title: "Verification Successful!",
        description: "You have been logged in successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error('❌ MfaVerification: Verification error:', error);
      setHasError(true);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification code.",
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
      console.log('🔄 MfaVerification: Resending verification code');
      await mfaAuthService.resendCode();
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setIsEmailConfirmed(true);
      setTimeout(() => setIsEmailConfirmed(false), 3000);
    } catch (error: any) {
      console.error('❌ MfaVerification: Resend error:', error);
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
    
    console.log('🔢 MfaVerification: OTP code changed:', newCode.join(''), 'length:', newCode.join('').length);
    
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

  console.log('🔐 MfaVerification render:', { email, code: code.join('').length, isVerifying, hasError });

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

          <MfaActions
            code={code}
            isVerifying={isVerifying}
            isResending={isResending}
            canResend={canResend}
            timeLeft={timeLeft}
            onVerify={handleVerify}
            onResend={handleResend}
            onCancel={onCancel}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MfaVerification;
