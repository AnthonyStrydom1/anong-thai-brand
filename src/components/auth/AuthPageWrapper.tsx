
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
    hasUser: !!user,
    mfaPending,
    currentPath: window.location.pathname
  });

  // If MFA is pending from auth state, always show MFA screen
  if (mfaPending) {
    const pendingEmail = mfaAuthService.getPendingMFAEmail() || '';
    console.log('🔐 AuthPageWrapper: MFA pending from auth state, showing MFA screen for:', pendingEmail);
    return (
      <MfaPageView
        email={pendingEmail}
        onSuccess={() => {
          console.log('✅ AuthPageWrapper: MFA success from auth state flow');
          mfaAuthService.clearMFASession();
          // Don't navigate - let auth state changes handle it
        }}
        onCancel={() => {
          console.log('❌ AuthPageWrapper: MFA cancelled from auth state flow');
          mfaAuthService.clearMFASession();
          // Don't navigate - let auth state changes handle it
        }}
      />
    );
  }

  // Show loading while checking MFA status
  if (isCheckingMFA) {
    console.log('⏳ AuthPageWrapper: Still checking MFA status...');
    return <LoadingView />;
  }

  // Show MFA verification if needed (local state)
  if (showMFA && mfaEmail) {
    console.log('🔐 AuthPageWrapper: Showing MFA from local state for:', mfaEmail);
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
