
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface FormHeaderProps {
  isLogin: boolean;
}

const FormHeader = ({ isLogin }: FormHeaderProps) => {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">
        {isLogin ? 'Sign In' : 'Create Account'}
      </CardTitle>
      <CardDescription>
        {isLogin 
          ? 'Welcome back! Please sign in to your account.' 
          : 'Create a new account to get started.'
        }
      </CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
