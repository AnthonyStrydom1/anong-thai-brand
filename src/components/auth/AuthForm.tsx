
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FormHeader from './FormHeader';
import NameFields from './NameFields';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import ForgotPasswordSection from './ForgotPasswordSection';
import FormActions from './FormActions';

interface AuthFormProps {
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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onSwitchMode: () => void;
}

const AuthForm = ({
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
}: AuthFormProps) => {
  return (
    <Card className="w-full max-w-md">
      <FormHeader isLogin={isLogin} />
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {!isLogin && (
            <NameFields
              firstName={formData.firstName}
              lastName={formData.lastName}
              isLoading={isLoading}
              onChange={onInputChange}
            />
          )}

          <EmailField
            email={formData.email}
            isLoading={isLoading}
            onChange={onInputChange}
          />

          <PasswordField
            password={formData.password}
            showPassword={showPassword}
            isLoading={isLoading}
            onChange={onInputChange}
            onTogglePassword={onTogglePassword}
          />

          {isLogin && showForgotPassword && (
            <ForgotPasswordSection
              isLoading={isLoading}
              onForgotPassword={onForgotPassword}
            />
          )}

          <FormActions
            isLogin={isLogin}
            isLoading={isLoading}
            onSwitchMode={onSwitchMode}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
