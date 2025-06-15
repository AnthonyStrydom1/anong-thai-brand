
import React from 'react';
import NavigationBanner from '@/components/NavigationBanner';
import AuthForm from '@/components/auth/AuthForm';

interface AuthFormViewProps {
  isLogin: boolean;
  isLoading: boolean;
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
  showPassword,
  showForgotPassword,
  formData,
  onTogglePassword,
  onInputChange,
  onSubmit,
  onForgotPassword,
  onSwitchMode
}: AuthFormViewProps) => {
  console.log('📝 AuthFormView: Rendering auth form');
  
  // Convert the field-based onChange to the expected event-based onChange
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.name, e.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
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
