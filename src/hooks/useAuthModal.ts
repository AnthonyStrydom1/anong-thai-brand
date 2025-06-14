
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useAuthModal = () => {
  const { signIn, signUp, resetPassword } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, firstName, lastName);
        toast({
          title: 'Account created successfully!',
          description: 'Please check your email to confirm your account.',
        });
      } else {
        await signIn(email, password);
        toast({
          title: 'Successfully signed in!',
        });
      }
      handleCloseModal();
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: isSignUp ? 'Sign up failed' : 'Sign in failed',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
      
      // Show forgot password option for login failures
      if (!isSignUp && error.message?.includes('Invalid login credentials')) {
        setShowForgotPassword(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
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

  const handleCloseModal = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setIsSignUp(false);
    setShowForgotPassword(false);
    setShowLoginModal(false);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (showForgotPassword) setShowForgotPassword(false);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (showForgotPassword) setShowForgotPassword(false);
  };

  return {
    showLoginModal,
    setShowLoginModal,
    isSignUp,
    setIsSignUp,
    showForgotPassword,
    email,
    password,
    firstName,
    lastName,
    isLoading,
    handleAuthSubmit,
    handleForgotPassword,
    handleCloseModal,
    handleEmailChange,
    handlePasswordChange,
    setFirstName,
    setLastName,
  };
};
