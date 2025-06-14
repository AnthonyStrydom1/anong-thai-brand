
import { useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const { signUp, signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      }
      
      // Both login and signup now return MFA indication
      return result;
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: isLogin ? 'Sign in failed' : 'Sign up failed',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
      
      // Show forgot password option for login failures
      if (isLogin && error.message?.includes('Invalid login credentials')) {
        setShowForgotPassword(true);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(formData.email);
      toast({
        title: "Reset Email Sent!",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (showForgotPassword) setShowForgotPassword(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setShowForgotPassword(false);
  };

  const switchToSignUp = () => {
    setIsLogin(false);
    setShowForgotPassword(false);
  };

  return {
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
  };
};
