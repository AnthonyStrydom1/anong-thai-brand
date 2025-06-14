
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import NavigationBanner from '@/components/NavigationBanner';
import { mfaAuthService } from '@/services/mfaAuthService';
import MfaVerification from '@/components/auth/MfaVerification';
import AuthForm from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';

const AuthPage = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [mfaEmail, setMfaEmail] = useState<string>('');
  const navigate = useNavigate();

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

  // Check for existing MFA session on mount
  useEffect(() => {
    console.log('🔍 Checking for existing MFA session...');
    const pendingEmail = mfaAuthService.getPendingMFAEmail();
    if (pendingEmail) {
      console.log('✅ Found existing MFA session for:', pendingEmail);
      setShowMFA(true);
      setMfaEmail(pendingEmail);
    }
  }, []);

  // Listen for MFA session events
  useEffect(() => {
    const handleMFAStored = (event: CustomEvent) => {
      console.log('📧 MFA session stored event received:', event.detail);
      const email = event.detail?.email;
      if (email) {
        setShowMFA(true);
        setMfaEmail(email);
        toast({
          title: isLogin ? "MFA Required" : "Account Created!",
          description: isLogin 
            ? "Please check your email for the verification code."
            : "Please check your email for the verification code to complete your registration.",
        });
      }
    };

    const handleMFACleared = () => {
      console.log('🧹 MFA session cleared event received');
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
      console.log('🚀 Starting form submission...');
      const result = await handleSubmit(e);
      console.log('📝 Form submission result:', result);
      
      if (result?.mfaRequired) {
        console.log('🔐 MFA required! Checking for session data...');
        
        // Give a small delay for the MFA service to complete setup
        setTimeout(() => {
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          if (pendingEmail) {
            console.log('✅ MFA session found, showing verification');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
            
            toast({
              title: isLogin ? "MFA Required" : "Account Created!",
              description: isLogin 
                ? "Please check your email for the verification code."
                : "Please check your email for the verification code to complete your registration.",
            });
          } else {
            console.log('⚠️ MFA required but no session found');
          }
        }, 500);
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
    }
  };

  const handleMFASuccess = () => {
    console.log('✅ MFA verification successful');
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
    console.log('❌ MFA verification cancelled');
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
    isLogin
  });

  // Show MFA verification if needed
  if (showMFA && mfaEmail) {
    console.log('🔐 Rendering MFA verification component for:', mfaEmail);
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

  console.log('📝 Rendering auth form');
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
