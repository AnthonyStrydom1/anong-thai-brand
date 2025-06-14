
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { mfaAuthService } from '@/services/mfaAuthService';
import { Shield, RefreshCw, AlertCircle } from 'lucide-react';

interface MfaVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MfaVerification = ({ email, onSuccess, onCancel }: MfaVerificationProps) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    if (code.length !== 6) {
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
      console.log('🔍 MfaVerification: Attempting verification with code:', code);
      await mfaAuthService.verifyAndSignIn(code);
      
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
      setCode('');
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md">
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
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleVerify}
            disabled={code.length !== 6 || isVerifying}
            className="w-full"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>
        </div>

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
      </CardContent>
    </Card>
  );
};

export default MfaVerification;
