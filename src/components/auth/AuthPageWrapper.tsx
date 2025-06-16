
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

  console.log('🎯 AuthPageWrapper render state:', { 
    showMFA, 
    mfaEmail, 
    isLogin,
    isCheckingMFA,
    mfaPending,
    hasUser: !!user
  });

  // Show loading while checking MFA status
  if (isCheckingMFA) {
    return <LoadingView />;
  }

  // CRITICAL: Always show MFA if mfaPending is true from auth state
  if (mfaPending) {
    const pendingEmail = mfaAuthService.getPendingMFAEmail() || '';
    console.log('🔐 AuthPageWrapper: MFA pending, showing MFA view for:', pendingEmail);
    return (
      <MfaPageView
        email={pendingEmail}
        onSuccess={handleMFASuccess}
        onCancel={handleMFACancel}
      />
    );
  }

  // Show MFA verification if local state indicates it
  if (showMFA && mfaEmail) {
    console.log('🔐 AuthPageWrapper: Local MFA state, showing MFA view for:', mfaEmail);
    return (
      <MfaPageView
        email={mfaEmail}
        onSuccess={handleMFASuccess}
        onCancel={handleMFACancel}
      />
    );
  }

  // Show auth form
  console.log('📝 AuthPageWrapper: Showing auth form');
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
