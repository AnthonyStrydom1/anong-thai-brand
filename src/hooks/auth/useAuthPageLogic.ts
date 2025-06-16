
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { mfaAuthService } from '@/services/mfaAuthService';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/hooks/useAuth';

export const useAuthPageLogic = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [mfaEmail, setMfaEmail] = useState<string>('');
  const [isCheckingMFA, setIsCheckingMFA] = useState(true);
  const navigate = useNavigate();
  const { user, session, mfaPending } = useAuth();

  const {
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
  } = useAuthForm();

  // Redirect if already logged in (NO mfa pending)
  useEffect(() => {
    if (user && session && !mfaPending) {
      console.log('🏠 AuthPage: User fully authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, session, mfaPending, navigate]);

  // Check for existing MFA session on mount
  useEffect(() => {
    console.log('🔍 AuthPage: Checking for existing MFA session...');
    
    const checkMFAStatus = () => {
      const hasPending = mfaAuthService.hasPendingMFA();
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      console.log('📊 AuthPage: MFA Status Check:', { hasPending, pendingEmail });
      
      if (hasPending && pendingEmail) {
        console.log('✅ AuthPage: Found existing MFA session for:', pendingEmail);
        setShowMFA(true);
        setMfaEmail(pendingEmail);
      } else {
        console.log('❌ AuthPage: No existing MFA session found');
        setShowMFA(false);
        setMfaEmail('');
      }
      
      setIsCheckingMFA(false);
    };

    // Small delay to ensure all services are ready
    const timer = setTimeout(checkMFAStatus, 50);
    return () => clearTimeout(timer);
  }, []);

  // Listen for MFA session events
  useEffect(() => {
    const handleMFAStored = (event: CustomEvent) => {
      console.log('📧 AuthPage: MFA session stored event received:', event.detail);
      const email = event.detail?.email;
      if (email) {
        console.log('🔄 AuthPage: Switching to MFA verification for:', email);
        setShowMFA(true);
        setMfaEmail(email);
        setIsCheckingMFA(false);
        
        toast({
          title: isLogin ? "MFA Required" : "Account Created!",
          description: isLogin 
            ? "Please check your email for the verification code."
            : "Please check your email for the verification code to complete your registration.",
        });
      }
    };

    const handleMFACleared = () => {
      console.log('🧹 AuthPage: MFA session cleared event received');
      setShowMFA(false);
      setMfaEmail('');
    };

    window.addEventListener('mfa-session-stored', handleMFAStored as EventListener);
    window.addEventListener('mfa-session-cleared', handleMFACleared as EventListener);

    return () => {
      window.removeEventListener('mfa-session-stored', handleMFAStored as EventListener);
      window.removeEventListener('mfa-session-cleared', handleMFACleared as EventListener);
    };
  }, [isLogin, navigate]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🚀 AuthPage: Starting form submission...');
      const result = await handleSubmit(e);
      console.log('📝 AuthPage: Form submission result:', result);
      
      // Check for MFA requirement
      if (result?.mfaRequired) {
        console.log('🔐 AuthPage: MFA required! Checking for MFA session...');
        
        // Wait for the MFA session to be stored
        setTimeout(() => {
          const hasPending = mfaAuthService.hasPendingMFA();
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          console.log('🔍 AuthPage: Post-submit MFA check:', { hasPending, pendingEmail });
          
          if (hasPending && pendingEmail) {
            console.log('✅ AuthPage: MFA session found, showing OTP screen');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
          }
        }, 200);
      }
    } catch (error) {
      console.error('❌ AuthPage: Form submission error:', error);
    }
  };

  const handleMFASuccess = () => {
    console.log('✅ AuthPage: MFA verification successful');
    
    toast({
      title: "Success!",
      description: "You have been logged in successfully.",
    });
    
    // Clear MFA state in UI immediately but let service handle session cleanup
    setShowMFA(false);
    setMfaEmail('');
    
    // Wait longer for auth state to fully propagate before redirecting
    console.log('⏳ AuthPage: Waiting for auth state to stabilize before redirect...');
    
    setTimeout(() => {
      console.log('🏠 AuthPage: Navigating to home page');
      navigate('/', { replace: true });
    }, 2000); // Increased delay to 2 seconds
  };

  const handleMFACancel = () => {
    console.log('❌ AuthPage: MFA verification cancelled');
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
  };

  const handleSwitchMode = () => {
    // Clear MFA state when switching modes
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
    
    if (isLogin) {
      switchToSignUp();
    } else {
      switchToLogin();
    }
  };

  return {
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
  };
};
