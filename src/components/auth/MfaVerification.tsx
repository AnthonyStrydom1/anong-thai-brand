
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';
import { mfaAuthService } from '@/services/mfaAuthService';
import { Shield, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (value: string) => {
    console.log('🔢 MfaVerification: OTP code changed:', value, 'length:', value.length);
    setCode(value);
    setHasError(false); // Clear error when user starts typing
  };

  console.log('🔐 MfaVerification render:', { email, code: code.length, isVerifying, hasError });

  return (
    <Card className="w-full max-w-md mx-auto">
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
        {isEmailConfirmed && (
          <div className="bg-green-50 p-3 rounded-md border border-green-200 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800">
              Verification code sent successfully!
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Enter verification code
            </label>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={code[index] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 1 && /^[0-9]*$/.test(value)) {
                        const newCode = code.split('');
                        newCode[index] = value;
                        const updatedCode = newCode.join('').slice(0, 6);
                        handleCodeChange(updatedCode);
                        
                        // Auto-focus next input
                        if (value && index < 5) {
                          const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace
                      if (e.key === 'Backspace' && !code[index] && index > 0) {
                        const prevInput = e.target.parentElement?.children[index - 1] as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                    disabled={isVerifying}
                  />
                ))}
              </div>
            </div>
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
