
import React from 'react';
import { mfaAuthService } from '@/services/mfaAuthService';
import { useAuthPageLogic } from '@/hooks/auth/useAuthPageLogic';
import LoadingView from './LoadingView';
import MfaPageView from './MfaPageView';
import AuthFormView from './AuthFormView';

const AuthPageWrapper = () => {
  const {
    showMFA,
    mfaEmail,
    isCheckingMFA,
    user,
    mfaPending,
    isLogin,
    isLoading,
    showPassword,
    showForgotPassword,
    formData,
    setShowPassword,
    handleFormSubmit,
    handleForgotPassword,
    handleInputChange,
    handleMFASuccess,
    handleMFACancel,
    handleSwitchMode
  } = useAuthPageLogic();

  console.log('🎯 AuthPage render state:', { 
    showMFA, 
    mfaEmail, 
    isLogin,
    isCheckingMFA,
    hasUser: !!user
  });

  // If MFA is pending, always render the OTP screen
  if (mfaPending) {
    // Get the most up-to-date pending MFA email
    const pendingEmail = mfaAuthService.getPendingMFAEmail() || '';
    return (
      <MfaPageView
        email={pendingEmail}
        onSuccess={() => {
          mfaAuthService.clearMFASession();
          // Navigation handled by auth state change
        }}
        onCancel={() => {
          mfaAuthService.clearMFASession();
          // Navigation handled by clearing MFA state
        }}
      />
    );
  }

  // Show loading while checking MFA status
  if (isCheckingMFA) {
    return <LoadingView />;
  }

  // Show MFA verification if needed
  if (showMFA && mfaEmail) {
    return (
      <MfaPageView
        email={mfaEmail}
        onSuccess={handleMFASuccess}
        onCancel={handleMFACancel}
      />
    );
  }

  // Show auth form
  return (
    <AuthFormView
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
  );
};

export default AuthPageWrapper;
