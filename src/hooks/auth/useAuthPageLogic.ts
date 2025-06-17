
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
  const { user, mfaPending } = useAuth();

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
    if (user && !mfaPending) {
      console.log('🏠 AuthPageLogic: User authenticated and no MFA pending, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [user, mfaPending, navigate]);

  // Check for existing MFA session on mount
  useEffect(() => {
    console.log('🔍 AuthPageLogic: Checking for existing MFA session...');
    
    const checkMFAStatus = () => {
      const hasPending = mfaAuthService.hasPendingMFA();
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      console.log('📊 AuthPageLogic: MFA Status Check:', { hasPending, pendingEmail });
      
      if (hasPending && pendingEmail) {
        console.log('✅ AuthPageLogic: Found existing MFA session for:', pendingEmail);
        setShowMFA(true);
        setMfaEmail(pendingEmail);
      } else {
        console.log('❌ AuthPageLogic: No existing MFA session found');
        setShowMFA(false);
        setMfaEmail('');
      }
      
      setIsCheckingMFA(false);
    };

    checkMFAStatus();
  }, []);

  // Listen for MFA session events
  useEffect(() => {
    const handleMFAStored = (event: CustomEvent) => {
      console.log('📧 AuthPageLogic: MFA session stored event received:', event.detail);
      const email = event.detail?.email;
      if (email) {
        console.log('🔄 AuthPageLogic: Switching to MFA verification for:', email);
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
      console.log('🧹 AuthPageLogic: MFA session cleared event received');
      setShowMFA(false);
      setMfaEmail('');
    };

    window.addEventListener('mfa-session-stored', handleMFAStored as EventListener);
    window.addEventListener('mfa-session-cleared', handleMFACleared as EventListener);

    return () => {
      window.removeEventListener('mfa-session-stored', handleMFAStored as EventListener);
      window.removeEventListener('mfa-session-cleared', handleMFACleared as EventListener);
    };
  }, [isLogin]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🚀 AuthPageLogic: Starting form submission...');
      const result = await handleSubmit(e);
      console.log('📝 AuthPageLogic: Form submission result:', result);
      
      // Force MFA check after successful form submission
      if (result?.mfaRequired) {
        console.log('🔐 AuthPageLogic: MFA required! Checking for MFA session...');
        // Wait a bit for the MFA session to be stored
        setTimeout(() => {
          const hasPending = mfaAuthService.hasPendingMFA();
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          console.log('🔍 AuthPageLogic: Post-submit MFA check:', { hasPending, pendingEmail });
          
          if (hasPending && pendingEmail) {
            console.log('✅ AuthPageLogic: MFA session found, showing OTP screen');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
          }
        }, 500);
      }
    } catch (error) {
      console.error('❌ AuthPageLogic: Form submission error:', error);
    }
  };

  const handleMFASuccess = () => {
    console.log('✅ AuthPageLogic: MFA verification successful');
    
    // Clear MFA state immediately
    setShowMFA(false);
    setMfaEmail('');
    
    toast({
      title: "Success!",
      description: "You have been logged in successfully.",
    });
    
    // Navigation will be handled by the auth state change in the main useEffect
    console.log('🏠 AuthPageLogic: MFA success - navigation will be handled by auth state');
  };

  const handleMFACancel = () => {
    console.log('❌ AuthPageLogic: MFA verification cancelled');
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
