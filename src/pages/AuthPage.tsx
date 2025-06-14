
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

  // Check for pending MFA on component mount and when URL changes
  useEffect(() => {
    console.log('Checking for pending MFA...');
    const hasPending = mfaAuthService.hasPendingMFA();
    const pendingEmail = mfaAuthService.getPendingMFAEmail();
    console.log('Has pending MFA:', hasPending, 'Email:', pendingEmail);
    
    if (hasPending && pendingEmail) {
      console.log('Setting showMFA to true');
      setShowMFA(true);
    }
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
        console.log('MFA required, showing verification UI');
        setShowMFA(true);
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
