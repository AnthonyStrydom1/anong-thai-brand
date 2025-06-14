import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { mfaAuthService } from '@/services/mfaAuthService';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

interface FormData {
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
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginAttempted(true);

    try {
      if (isLogin) {
        // Use MFA service for login - this should ALWAYS require MFA
        const result = await mfaAuthService.initiateSignIn({
          email: formData.email,
          password: formData.password
        });

        // MFA should always be required for login
        return { mfaRequired: true };
      } else {
        // For sign-up, create account without auto-login
        await authService.signUp({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
        
        // Wait a moment to ensure signup completes
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // After successful sign-up, initiate MFA flow (no auto-login)
        try {
          const mfaResult = await mfaAuthService.initiateSignIn({
            email: formData.email,
            password: formData.password
          });

          // Always require MFA for new accounts
          return { mfaRequired: true };
        } catch (mfaError) {
          console.error('MFA initiation failed after signup:', mfaError);
          toast({
            title: "Account Created!",
            description: "Your account has been created. Please try signing in with MFA verification.",
          });
          setIsLogin(true); // Switch to login mode
          return { mfaRequired: false };
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = error.message || "An error occurred during authentication.";
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials.";
        if (isLogin) {
          setShowForgotPassword(true);
        }
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and confirm your account before signing in.";
      } else if (error.message?.includes('User already registered')) {
        errorMessage = "An account with this email already exists. Please sign in instead.";
        setIsLogin(true);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Hide forgot password when user starts typing again
    if (e.target.name === 'password' && showForgotPassword) {
      setShowForgotPassword(false);
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setShowForgotPassword(false);
    setLoginAttempted(false);
  };

  const switchToSignUp = () => {
    setIsLogin(false);
    setShowForgotPassword(false);
    setLoginAttempted(false);
  };

  return {
    isLogin,
    isLoading,
    showPassword,
    showForgotPassword,
    loginAttempted,
    formData,
    setShowPassword,
    handleSubmit,
    handleForgotPassword,
    handleInputChange,
    switchToLogin,
    switchToSignUp
  };
};
