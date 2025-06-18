
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

  const authFormHook = useAuthForm();

  // Redirect authenticated users to home
  useEffect(() => {
    if (user && !mfaPending) {
      console.log('🏠 AuthPageLogic: User authenticated, redirecting home');
      navigate('/', { replace: true });
    }
  }, [user, mfaPending, navigate]);

  // Check for existing MFA session
  useEffect(() => {
    console.log('🔍 AuthPageLogic: Checking MFA status');
    
    const checkMFAStatus = () => {
      const hasPending = mfaAuthService.hasPendingMFA();
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      console.log('📊 AuthPageLogic: MFA Status:', { hasPending, pendingEmail });
      
      if (hasPending && pendingEmail) {
        console.log('✅ AuthPageLogic: Found MFA session for:', pendingEmail);
        setShowMFA(true);
        setMfaEmail(pendingEmail);
      } else {
        console.log('❌ AuthPageLogic: No MFA session found');
        setShowMFA(false);
        setMfaEmail('');
      }
      
      setIsCheckingMFA(false);
    };

    checkMFAStatus();
  }, []);

  // Listen for MFA events
  useEffect(() => {
    const handleMFAStored = (event: CustomEvent) => {
      console.log('📧 AuthPageLogic: MFA session stored:', event.detail);
      const email = event.detail?.email;
      if (email) {
        console.log('🔄 AuthPageLogic: Switching to MFA for:', email);
        setShowMFA(true);
        setMfaEmail(email);
        setIsCheckingMFA(false);
        
        toast({
          title: authFormHook.isLogin ? "MFA Required" : "Account Created!",
          description: authFormHook.isLogin 
            ? "Please check your email for the verification code."
            : "Please check your email for the verification code to complete registration.",
        });
      }
    };

    const handleMFACleared = () => {
      console.log('🧹 AuthPageLogic: MFA cleared');
      setShowMFA(false);
      setMfaEmail('');
    };

    window.addEventListener('mfa-session-stored', handleMFAStored as EventListener);
    window.addEventListener('mfa-session-cleared', handleMFACleared as EventListener);

    return () => {
      window.removeEventListener('mfa-session-stored', handleMFAStored as EventListener);
      window.removeEventListener('mfa-session-cleared', handleMFACleared as EventListener);
    };
  }, [authFormHook.isLogin]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🚀 AuthPageLogic: Form submission started');
      const result = await authFormHook.handleSubmit(e);
      console.log('📝 AuthPageLogic: Form result:', result);
      
      if (result?.mfaRequired) {
        console.log('🔐 AuthPageLogic: MFA required, checking session');
        setTimeout(() => {
          const hasPending = mfaAuthService.hasPendingMFA();
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          console.log('🔍 AuthPageLogic: Post-submit MFA check:', { hasPending, pendingEmail });
          
          if (hasPending && pendingEmail) {
            console.log('✅ AuthPageLogic: MFA session ready');
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
    console.log('✅ AuthPageLogic: MFA success');
    setShowMFA(false);
    setMfaEmail('');
    
    toast({
      title: "Success!",
      description: "You have been logged in successfully.",
    });
  };

  const handleMFACancel = () => {
    console.log('❌ AuthPageLogic: MFA cancelled');
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
  };

  const handleSwitchMode = () => {
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
    
    if (authFormHook.isLogin) {
      authFormHook.switchToSignUp();
    } else {
      authFormHook.switchToLogin();
    }
  };

  return {
    showMFA,
    mfaEmail,
    isCheckingMFA,
    user,
    mfaPending,
    ...authFormHook,
    handleFormSubmit,
    handleMFASuccess,
    handleMFACancel,
    handleSwitchMode
  };
};
