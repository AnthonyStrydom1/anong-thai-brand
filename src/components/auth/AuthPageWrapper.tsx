
import React from 'react';
import { useAuthPageLogic } from '@/hooks/auth/useAuthPageLogic';
import AuthFormView from './AuthFormView';

const AuthPageWrapper = () => {
  const {
    isLogin,
    isLoading,
    showPassword,
    showForgotPassword,
    formData,
    setShowPassword,
    handleFormSubmit,
    handleForgotPassword,
    handleInputChange,
    handleSwitchMode
  } = useAuthPageLogic();

  console.log('🎯 AuthPage render state (MFA disabled):', { 
    isLogin,
    isLoading
  });

  // Show auth form directly - no MFA handling needed
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
