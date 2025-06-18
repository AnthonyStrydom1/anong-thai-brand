
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { mfaAuthService } from '@/services/mfaAuthService';
import { authService } from '@/services/authService';

export interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const switchToSignUp = () => {
    setIsLogin(false);
    setShowForgotPassword(false);
    setFormData({ email: '', password: '', firstName: '', lastName: '' });
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setShowForgotPassword(false);
    setFormData({ email: '', password: '', firstName: '', lastName: '' });
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (showForgotPassword) setShowForgotPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && (!formData.firstName || !formData.lastName)) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        console.log('🔐 AuthForm: Starting login flow for:', formData.email);
        
        // Use MFA service for all logins - this will not show success toast prematurely
        const result = await mfaAuthService.initiateSignIn({
          email: formData.email,
          password: formData.password,
        });

        console.log('📋 AuthForm: Login result:', result);
        
        // Don't show success toast here - MFA flow will handle it after completion
        return result;
      } else {
        console.log('📝 AuthForm: Starting signup for:', formData.email);
        
        const result = await authService.signUp({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        if (result.user) {
          // For signup, we can show immediate success since no MFA is required
          toast({
            title: "Account Created!",
            description: "Please check your email to confirm your account.",
          });
        }

        return result;
      }
    } catch (error: any) {
      console.error('❌ AuthForm: Authentication error:', error);
      
      let errorMessage = error.message || 'An error occurred';
      
      // Handle specific error cases
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        setShowForgotPassword(true);
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (errorMessage.includes('Password should be at least 6 characters')) {
        errorMessage = 'Password must be at least 6 characters long.';
      }

      toast({
        title: isLogin ? "Sign In Failed" : "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });

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
      await authService.resetPassword(formData.email);
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

  return {
    isLogin,
    isLoading,
    showPassword,
    showForgotPassword,
    formData,
    setShowPassword,
    switchToSignUp,
    switchToLogin,
    handleInputChange,
    handleSubmit,
    handleForgotPassword,
  };
};
