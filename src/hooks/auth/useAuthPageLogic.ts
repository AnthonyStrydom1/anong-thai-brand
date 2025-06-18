
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { user, mfaPending } = useAuth();

  const authFormHook = useAuthForm();

  // Only redirect authenticated users to home when auth is fully complete
  useEffect(() => {
    if (user && !mfaPending && !showMFA && !isTransitioning) {
      console.log('🏠 AuthPageLogic: Full authentication complete, redirecting home');
      // Add a small delay to ensure clean transition
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    }
  }, [user, mfaPending, showMFA, isTransitioning, navigate]);

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
      const skipSuccessToast = event.detail?.skipSuccessToast;
      
      if (email) {
        console.log('🔄 AuthPageLogic: Switching to MFA for:', email);
        setIsTransitioning(true);
        setShowMFA(true);
        setMfaEmail(email);
        setIsCheckingMFA(false);
        
        // Only show toast if not skipped (to prevent premature success message)
        if (!skipSuccessToast) {
          toast({
            title: authFormHook.isLogin ? "MFA Required" : "Account Created!",
            description: authFormHook.isLogin 
              ? "Please check your email for the verification code."
              : "Please check your email for the verification code to complete registration.",
          });
        }
        
        // Clear transition state after a brief moment
        setTimeout(() => setIsTransitioning(false), 300);
      }
    };

    const handleMFACleared = () => {
      console.log('🧹 AuthPageLogic: MFA cleared');
      setShowMFA(false);
      setMfaEmail('');
      setIsTransitioning(false);
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
      setIsTransitioning(true);
      
      const result = await authFormHook.handleSubmit(e);
      console.log('📝 AuthPageLogic: Form result:', result);
      
      if (result?.mfaRequired) {
        console.log('🔐 AuthPageLogic: MFA required, checking session');
        // The MFA session should already be set up, just wait for UI update
        setTimeout(() => {
          const hasPending = mfaAuthService.hasPendingMFA();
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          console.log('🔍 AuthPageLogic: Post-submit MFA check:', { hasPending, pendingEmail });
          
          if (hasPending && pendingEmail) {
            console.log('✅ AuthPageLogic: MFA session ready');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
          }
          setIsTransitioning(false);
        }, 500);
      } else {
        setIsTransitioning(false);
      }
    } catch (error) {
      console.error('❌ AuthPageLogic: Form submission error:', error);
      setIsTransitioning(false);
    }
  };

  const handleMFASuccess = () => {
    console.log('✅ AuthPageLogic: MFA success');
    setIsTransitioning(true);
    setShowMFA(false);
    setMfaEmail('');
    
    // Show success toast only after MFA completion
    toast({
      title: "Successfully Signed In!",
      description: "Welcome back! Redirecting to your dashboard...",
    });

    // Clear transition state after toast
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const handleMFACancel = () => {
    console.log('❌ AuthPageLogic: MFA cancelled');
    setShowMFA(false);
    setMfaEmail('');
    setIsTransitioning(false);
    mfaAuthService.clearMFASession();
  };

  const handleSwitchMode = () => {
    setShowMFA(false);
    setMfaEmail('');
    setIsTransitioning(false);
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
    isTransitioning,
    user,
    mfaPending,
    ...authFormHook,
    handleFormSubmit,
    handleMFASuccess,
    handleMFACancel,
    handleSwitchMode
  };
};
