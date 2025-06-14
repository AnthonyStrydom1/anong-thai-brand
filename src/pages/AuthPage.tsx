
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

  // Check for MFA status on mount
  useEffect(() => {
    console.log('📱 AuthPage mounted, checking initial MFA state');
    
    const checkMFA = () => {
      const sessionData = sessionStorage.getItem('mfa_session_data');
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      console.log('🔍 Initial MFA Check:', {
        hasSessionData: !!sessionData,
        pendingEmail,
      });
      
      if (sessionData && pendingEmail) {
        console.log('✅ Found pending MFA, showing verification');
        setShowMFA(true);
        setMfaEmail(pendingEmail);
      }
    };
    
    checkMFA();
  }, []);

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
        
        // Poll for MFA session data with exponential backoff
        let attempts = 0;
        const maxAttempts = 10;
        
        const pollForMFA = () => {
          attempts++;
          const sessionData = sessionStorage.getItem('mfa_session_data');
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          
          console.log(`🔄 MFA Poll attempt ${attempts}:`, {
            hasSessionData: !!sessionData,
            pendingEmail,
          });
          
          if (sessionData && pendingEmail) {
            console.log('✅ MFA session found, showing verification');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
            
            toast({
              title: isLogin ? "MFA Required" : "Account Created!",
              description: isLogin 
                ? "Please check your email for the verification code."
                : "Please check your email for the verification code to complete your registration.",
            });
          } else if (attempts < maxAttempts) {
            // Exponential backoff: 100ms, 200ms, 400ms, 800ms, etc.
            const delay = Math.min(100 * Math.pow(2, attempts - 1), 2000);
            setTimeout(pollForMFA, delay);
          } else {
            console.log('⚠️ MFA session not found after maximum attempts');
            toast({
              title: "Error",
              description: "Failed to initialize MFA verification. Please try again.",
              variant: "destructive"
            });
          }
        };
        
        // Start polling immediately
        pollForMFA();
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
    </div>
  );
};

export default AuthPage;
