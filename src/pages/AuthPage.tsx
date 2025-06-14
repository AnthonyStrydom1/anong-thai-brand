import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import NavigationBanner from '@/components/NavigationBanner';
import { mfaAuthService } from '@/services/mfaAuthService';
import MfaVerification from '@/components/auth/MfaVerification';
import AuthForm from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/hooks/useAuth';

const AuthPage = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [mfaEmail, setMfaEmail] = useState<string>('');
  const [isCheckingMFA, setIsCheckingMFA] = useState(true);
  const navigate = useNavigate();
  const { user, mfaPending } = useAuth();

  const {
    isLogin,
    isLoading,
    showPassword,
    showForgotPassword,
    formData,
    setShowPassword,
    handleSubmit,
    handleForgotPassword,
    handleInputChange,
    switchToLogin,
    switchToSignUp
  } = useAuthForm();

  // Redirect if already logged in (NO mfa pending)
  useEffect(() => {
    if (user && !mfaPending) {
      navigate('/');
    }
  }, [user, mfaPending, navigate]);

  // If MFA is pending, always render the OTP screen
  if (mfaPending) {
    // Get the most up-to-date pending MFA email
    const pendingEmail = mfaAuthService.getPendingMFAEmail() || '';
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 flex items-center justify-center p-4">
          <MfaVerification
            email={pendingEmail}
            onSuccess={() => {
              mfaAuthService.clearMFASession();
              navigate('/');
            }}
            onCancel={() => {
              mfaAuthService.clearMFASession();
              navigate('/auth');
            }}
          />
        </div>
      </div>
    );
  }

  // Check for existing MFA session on mount
  useEffect(() => {
    console.log('🔍 AuthPage: Checking for existing MFA session...');
    
    const checkMFAStatus = () => {
      const hasPending = mfaAuthService.hasPendingMFA();
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      console.log('📊 AuthPage: MFA Status Check:', { hasPending, pendingEmail });
      
      if (hasPending && pendingEmail) {
        console.log('✅ AuthPage: Found existing MFA session for:', pendingEmail);
        setShowMFA(true);
        setMfaEmail(pendingEmail);
      } else {
        console.log('❌ AuthPage: No existing MFA session found');
        setShowMFA(false);
        setMfaEmail('');
      }
      
      setIsCheckingMFA(false);
    };

    // Check MFA status with a small delay to ensure all services are ready
    const timer = setTimeout(checkMFAStatus, 100);
    return () => clearTimeout(timer);
  }, []);

  // Listen for MFA session events
  useEffect(() => {
    const handleMFAStored = (event: CustomEvent) => {
      console.log('📧 AuthPage: MFA session stored event received:', event.detail);
      const email = event.detail?.email;
      if (email) {
        console.log('🔄 AuthPage: Switching to MFA verification for:', email);
        setShowMFA(true);
        setMfaEmail(email);
        setIsCheckingMFA(false);
        
        toast({
          title: isLogin ? "MFA Required" : "Account Created!",
          description: isLogin 
            ? "Please check your email for the verification code."
            : "Please check your email for the verification code to complete your registration.",
        });
      }
    };

    const handleMFACleared = () => {
      console.log('🧹 AuthPage: MFA session cleared event received');
      setShowMFA(false);
      setMfaEmail('');
    };

    window.addEventListener('mfa-session-stored', handleMFAStored as EventListener);
    window.addEventListener('mfa-session-cleared', handleMFACleared as EventListener);

    return () => {
      window.removeEventListener('mfa-session-stored', handleMFAStored as EventListener);
      window.removeEventListener('mfa-session-cleared', handleMFACleared as EventListener);
    };
  }, [isLogin]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🚀 AuthPage: Starting form submission...');
      const result = await handleSubmit(e);
      console.log('📝 AuthPage: Form submission result:', result);
      
      // Force MFA check after successful form submission
      if (result?.mfaRequired) {
        console.log('🔐 AuthPage: MFA required! Checking for MFA session...');
        // Wait a bit for the MFA session to be stored
        setTimeout(() => {
          const hasPending = mfaAuthService.hasPendingMFA();
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          console.log('🔍 AuthPage: Post-submit MFA check:', { hasPending, pendingEmail });
          
          if (hasPending && pendingEmail) {
            console.log('✅ AuthPage: MFA session found, showing OTP screen');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
          }
        }, 500);
      }
    } catch (error) {
      console.error('❌ AuthPage: Form submission error:', error);
    }
  };

  const handleMFASuccess = () => {
    console.log('✅ AuthPage: MFA verification successful');
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
    toast({
      title: "Success!",
      description: "You have been logged in successfully.",
    });
    navigate('/');
  };

  const handleMFACancel = () => {
    console.log('❌ AuthPage: MFA verification cancelled');
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
  };

  const handleSwitchMode = () => {
    // Clear MFA state when switching modes
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
    
    if (isLogin) {
      switchToSignUp();
    } else {
      switchToLogin();
    }
  };

  console.log('🎯 AuthPage render state:', { 
    showMFA, 
    mfaEmail, 
    isLogin,
    isCheckingMFA,
    hasUser: !!user
  });

  // Show loading while checking MFA status
  if (isCheckingMFA) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show MFA verification if needed
  if (showMFA && mfaEmail) {
    console.log('🔐 AuthPage: Rendering MFA verification component for:', mfaEmail);
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 flex items-center justify-center p-4">
          <MfaVerification
            email={mfaEmail}
            onSuccess={handleMFASuccess}
            onCancel={handleMFACancel}
          />
        </div>
      </div>
    );
  }

  console.log('📝 AuthPage: Rendering auth form');
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <AuthForm
            isLogin={isLogin}
            isLoading={isLoading}
            showPassword={showPassword}
            showForgotPassword={showForgotPassword}
            formData={formData}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onInputChange={handleInputChange}
            onSubmit={handleFormSubmit}
            onForgotPassword={handleForgotPassword}
            onSwitchMode={handleSwitchMode}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
