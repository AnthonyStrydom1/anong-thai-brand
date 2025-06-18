
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mfaAuthService } from '@/services/mfaAuthService';

interface MfaVerificationProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const MfaVerification = ({ email, onSuccess, onCancel }: MfaVerificationProps) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (code.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      console.log('🔐 MfaVerification: Starting verification process');
      await mfaAuthService.verifyAndSignIn(code.trim());
      console.log('✅ MfaVerification: Verification successful');
      
      // Call success handler which will show the success toast
      onSuccess();
    } catch (error: any) {
      console.error('❌ MfaVerification: Verification failed:', error);
      
      let errorMessage = error.message || 'Verification failed';
      
      if (errorMessage.includes('expired')) {
        errorMessage = 'Your verification code has expired. Please request a new one.';
        setTimeLeft(0); // Allow immediate resend
      } else if (errorMessage.includes('Invalid verification code')) {
        errorMessage = 'Invalid verification code. Please check and try again.';
      }
      
      setError(errorMessage);
      
      // Clear the code field for retry
      setCode('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await mfaAuthService.resendCode();
      
      if (result.success) {
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email.",
        });
        setTimeLeft(60); // 60 second cooldown
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch (error: any) {
      console.error('❌ MfaVerification: Resend failed:', error);
      setError(error.message || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = () => {
    console.log('❌ MfaVerification: User cancelled MFA flow');
    onCancel();
  };

  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    
    const visiblePart = localPart.slice(0, 2);
    const hiddenPart = '*'.repeat(Math.min(localPart.length - 2, 4));
    return `${visiblePart}${hiddenPart}@${domain}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-semibold">Verify Your Identity</CardTitle>
        <CardDescription className="text-gray-600">
          We've sent a 6-digit verification code to{' '}
          <span className="font-medium text-gray-900">{formatEmail(email)}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
                if (error) setError('');
              }}
              className="text-center text-lg tracking-widest font-mono"
              disabled={isVerifying}
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isVerifying || code.length !== 6}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify & Sign In'
            )}
          </Button>
        </form>

        <div className="space-y-3 pt-2">
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={handleResend}
              disabled={isResending || timeLeft > 0}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : timeLeft > 0 ? (
                `Resend code in ${timeLeft}s`
              ) : (
                'Resend verification code'
              )}
            </Button>
          </div>

          <div className="text-center border-t pt-3">
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={handleCancel}
              disabled={isVerifying}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2">
          <p>Didn't receive the email? Check your spam folder or try resending the code.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MfaVerification;
