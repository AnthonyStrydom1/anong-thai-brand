
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
  const [debugInfo, setDebugInfo] = useState<string>('');
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

  // Function to check MFA status and update state
  const checkMFAStatus = () => {
    const hasPending = mfaAuthService.hasPendingMFA();
    const pendingEmail = mfaAuthService.getPendingMFAEmail();
    const sessionData = sessionStorage.getItem('mfa_session_data');
    const challengeId = sessionStorage.getItem('mfa_challenge_id');
    
    const debug = `MFA Check - Has pending: ${hasPending}, Email: ${pendingEmail || 'none'}, Session data: ${!!sessionData}, Challenge: ${!!challengeId}`;
    console.log(debug);
    setDebugInfo(debug);
    
    if (hasPending && pendingEmail) {
      console.log('Setting showMFA to true');
      setShowMFA(true);
    } else {
      setShowMFA(false);
    }
  };

  // Check for pending MFA on component mount and periodically
  useEffect(() => {
    console.log('AuthPage mounted, checking for pending MFA...');
    checkMFAStatus();
    
    // Check again after a short delay in case data was just set
    const timeoutId = setTimeout(checkMFAStatus, 100);
    
    // Set up an interval to check periodically
    const intervalId = setInterval(checkMFAStatus, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    try {
      console.log('Submitting auth form...');
      const result = await handleSubmit(e);
      console.log('Auth result:', result);
      
      if (result?.mfaRequired) {
        console.log('MFA required, checking status after delay...');
        // Check MFA status after a short delay to allow session storage to be set
        setTimeout(checkMFAStatus, 500);
        
        toast({
          title: isLogin ? "MFA Required" : "Account Created!",
          description: isLogin 
            ? "Please check your email for the verification code."
            : "Please check your email for the verification code to complete your registration.",
        });
      }
    } catch (error) {
      console.error('Auth form submission error:', error);
      // Error handling is done in useAuthForm
    }
  };

  const handleMFASuccess = () => {
    console.log('MFA verification successful');
    setShowMFA(false);
    toast({
      title: "Success!",
      description: "You have been logged in successfully.",
    });
    navigate('/');
  };

  const handleMFACancel = () => {
    console.log('MFA verification cancelled');
    setShowMFA(false);
    mfaAuthService.clearMFASession();
    checkMFAStatus();
  };

  const handleSwitchMode = () => {
    if (isLogin) {
      switchToSignUp();
    } else {
      switchToLogin();
    }
  };

  // Get the pending email for MFA
  const pendingMFAEmail = mfaAuthService.getPendingMFAEmail();
  
  console.log('Current state - showMFA:', showMFA, 'pendingEmail:', pendingMFAEmail);

  // Show MFA verification if needed
  if (showMFA && pendingMFAEmail) {
    console.log('Rendering MFA verification component');
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 flex items-center justify-center p-4">
          <MfaVerification
            email={pendingMFAEmail}
            onSuccess={handleMFASuccess}
            onCancel={handleMFACancel}
          />
        </div>
      </div>
    );
  }

  console.log('Rendering auth form');
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        {/* Debug info display */}
        {debugInfo && (
          <div className="fixed top-4 left-4 bg-blue-100 p-2 rounded text-xs z-50 max-w-md">
            <strong>Debug:</strong> {debugInfo}
            <button 
              onClick={checkMFAStatus}
              className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
            >
              Refresh
            </button>
          </div>
        )}
        
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
