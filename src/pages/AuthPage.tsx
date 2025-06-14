
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

  // Check for MFA status on mount and set up monitoring
  useEffect(() => {
    const checkMFAStatus = () => {
      const hasPending = mfaAuthService.hasPendingMFA();
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      console.log('🔍 MFA Status Check:', {
        hasPending,
        pendingEmail,
        sessionData: !!sessionStorage.getItem('mfa_session_data'),
        challengeId: !!sessionStorage.getItem('mfa_challenge_id')
      });
      
      if (hasPending && pendingEmail) {
        console.log('✅ Showing MFA verification for:', pendingEmail);
        setShowMFA(true);
        setMfaEmail(pendingEmail);
      } else {
        setShowMFA(false);
        setMfaEmail('');
      }
    };

    // Initial check
    checkMFAStatus();
    
    // Monitor session storage changes
    const handleStorageChange = () => {
      console.log('📦 Session storage changed, rechecking MFA status');
      setTimeout(checkMFAStatus, 100);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for session storage changes
    const interval = setInterval(checkMFAStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    try {
      console.log('🚀 Submitting auth form...');
      const result = await handleSubmit(e);
      console.log('📝 Auth result:', result);
      
      if (result?.mfaRequired) {
        console.log('🔐 MFA required! Waiting for session data...');
        
        // Give the MFA service time to set session data
        setTimeout(() => {
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          if (pendingEmail) {
            console.log('✅ MFA session ready, showing verification');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
            
            toast({
              title: isLogin ? "MFA Required" : "Account Created!",
              description: isLogin 
                ? "Please check your email for the verification code."
                : "Please check your email for the verification code to complete your registration.",
            });
          } else {
            console.log('⚠️ No MFA email found, retrying...');
            // Retry after another delay
            setTimeout(() => {
              const retryEmail = mfaAuthService.getPendingMFAEmail();
              if (retryEmail) {
                setShowMFA(true);
                setMfaEmail(retryEmail);
              }
            }, 500);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Auth form submission error:', error);
      // Error handling is done in useAuthForm
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

  console.log('🎯 Current AuthPage state:', { showMFA, mfaEmail, isLogin });

  // Show MFA verification if needed
  if (showMFA && mfaEmail) {
    console.log('🔐 Rendering MFA verification component');
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
  );
};

export default AuthPage;
