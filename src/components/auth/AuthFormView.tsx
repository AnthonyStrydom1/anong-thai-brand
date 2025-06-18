
import React from 'react';
import NavigationBanner from '@/components/NavigationBanner';
import AuthForm from './AuthForm';
import LoadingTransition from './LoadingTransition';

interface AuthFormViewProps {
  isLogin: boolean;
  isLoading: boolean;
  isTransitioning?: boolean;
  showPassword: boolean;
  showForgotPassword: boolean;
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  onTogglePassword: () => void;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onSwitchMode: () => void;
}

const AuthFormView = ({
  isLogin,
  isLoading,
  isTransitioning = false,
  showPassword,
  showForgotPassword,
  formData,
  onTogglePassword,
  onInputChange,
  onSubmit,
  onForgotPassword,
  onSwitchMode
}: AuthFormViewProps) => {
  // Adapter function to convert change events to field/value format
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInputChange(name, value);
  };

  // Show loading transition when processing auth
  if (isTransitioning) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LoadingTransition 
              message={isLogin ? "Preparing secure login..." : "Setting up your account..."} 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm
            isLogin={isLogin}
            isLoading={isLoading}
            showPassword={showPassword}
            showForgotPassword={showForgotPassword}
            formData={formData}
            onTogglePassword={onTogglePassword}
            onInputChange={handleInputChange}
            onSubmit={onSubmit}
            onForgotPassword={onForgotPassword}
            onSwitchMode={onSwitchMode}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthFormView;
