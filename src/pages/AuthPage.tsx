
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

  // Enhanced MFA detection function
  const checkAndSetMFA = () => {
    const hasPending = mfaAuthService.hasPendingMFA();
    const pendingEmail = mfaAuthService.getPendingMFAEmail();
    const sessionData = sessionStorage.getItem('mfa_session_data');
    const challengeId = sessionStorage.getItem('mfa_challenge_id');
    
    console.log('🔍 Enhanced MFA Check:', {
      hasPending,
      pendingEmail,
      hasSessionData: !!sessionData,
      hasChallengeId: !!challengeId,
      currentShowMFA: showMFA,
      currentMfaEmail: mfaEmail
    });
    
    if (sessionData && pendingEmail) {
      console.log('✅ Setting MFA state - Email:', pendingEmail);
      setShowMFA(true);
      setMfaEmail(pendingEmail);
      return true;
    }
    
    return false;
  };

  // Check for MFA status on mount and set up monitoring
  useEffect(() => {
    console.log('📱 AuthPage mounted, checking initial MFA state');
    
    // Initial check
    checkAndSetMFA();
    
    // Set up interval to check for MFA state changes
    const mfaCheckInterval = setInterval(() => {
      if (!showMFA) { // Only check if not already showing MFA
        checkAndSetMFA();
      }
    }, 500);
    
    // Monitor session storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mfa_session_data' || e.key === 'mfa_challenge_id') {
        console.log('📦 Session storage changed:', e.key, e.newValue);
        setTimeout(checkAndSetMFA, 100);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(mfaCheckInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [showMFA]);

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
        console.log('🔐 MFA required! Starting enhanced detection...');
        
        // Force check after a short delay
        setTimeout(() => {
          const detected = checkAndSetMFA();
          if (detected) {
            toast({
              title: isLogin ? "MFA Required" : "Account Created!",
              description: isLogin 
                ? "Please check your email for the verification code."
                : "Please check your email for the verification code to complete your registration.",
            });
          } else {
            console.log('⚠️ MFA not detected immediately, will retry...');
          }
        }, 1000);
        
        // Backup check after longer delay
        setTimeout(() => {
          if (!showMFA) {
            console.log('🔄 Backup MFA check...');
            checkAndSetMFA();
          }
        }, 3000);
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
    isLogin,
    sessionData: !!sessionStorage.getItem('mfa_session_data'),
    challengeId: !!sessionStorage.getItem('mfa_challenge_id')
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
      
      {/* Debug panel - remove this after testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm">
          <div>Show MFA: {showMFA.toString()}</div>
          <div>MFA Email: {mfaEmail || 'none'}</div>
          <div>Session Data: {!!sessionStorage.getItem('mfa_session_data') ? 'yes' : 'no'}</div>
          <div>Challenge ID: {!!sessionStorage.getItem('mfa_challenge_id') ? 'yes' : 'no'}</div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
