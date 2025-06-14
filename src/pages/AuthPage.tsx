
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import NavigationBanner from '@/components/NavigationBanner';
import { mfaAuthService } from '@/services/mfaAuthService';
import MfaVerification from '@/components/auth/MfaVerification';
import AuthForm from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';

const AuthPage = () => {
  const [showMFA, setShowMFA] = useState(false);
  const [mfaEmail, setMfaEmail] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const navigate = useNavigate();

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

  // Check for MFA status on mount and set up polling
  useEffect(() => {
    console.log('📱 AuthPage mounted, setting up MFA detection');
    
    const checkMFA = () => {
      const sessionData = sessionStorage.getItem('mfa_session_data');
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      const debug = {
        hasSessionData: !!sessionData,
        pendingEmail,
        sessionDataContent: sessionData ? JSON.parse(sessionData) : null,
        timestamp: Date.now()
      };
      
      console.log('🔍 MFA Check:', debug);
      setDebugInfo(debug);
      
      if (sessionData && pendingEmail) {
        console.log('✅ Found pending MFA, showing verification');
        setShowMFA(true);
        setMfaEmail(pendingEmail);
        return true;
      }
      return false;
    };
    
    // Initial check
    if (checkMFA()) return;
    
    // Set up polling every 500ms for 10 seconds
    let attempts = 0;
    const maxAttempts = 20; // 10 seconds
    
    const pollInterval = setInterval(() => {
      attempts++;
      console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}`);
      
      if (checkMFA() || attempts >= maxAttempts) {
        clearInterval(pollInterval);
        if (attempts >= maxAttempts) {
          console.log('⏰ Stopped polling after max attempts');
        }
      }
    }, 500);
    
    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mfa_session_data' && e.newValue) {
        console.log('💾 Storage change detected for MFA session');
        setTimeout(checkMFA, 100); // Small delay to ensure data is fully written
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🚀 Starting form submission...');
      const result = await handleSubmit(e);
      console.log('📝 Form submission result:', result);
      
      if (result?.mfaRequired) {
        console.log('🔐 MFA required! Setting up detection...');
        
        // Add a small delay and then check for MFA data
        setTimeout(() => {
          const sessionData = sessionStorage.getItem('mfa_session_data');
          const pendingEmail = mfaAuthService.getPendingMFAEmail();
          
          console.log('🔍 Post-submit MFA check:', {
            hasSessionData: !!sessionData,
            pendingEmail,
          });
          
          if (sessionData && pendingEmail) {
            console.log('✅ MFA session found immediately');
            setShowMFA(true);
            setMfaEmail(pendingEmail);
            
            toast({
              title: isLogin ? "MFA Required" : "Account Created!",
              description: isLogin 
                ? "Please check your email for the verification code."
                : "Please check your email for the verification code to complete your registration.",
            });
          } else {
            console.log('⚠️ MFA session not found immediately, polling will handle it');
          }
        }, 100);
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
    }
  };

  const handleMFASuccess = () => {
    console.log('✅ MFA verification successful');
    setShowMFA(false);
    setMfaEmail('');
    mfaAuthService.clearMFASession();
    toast({
      title: "Success!",
      description: "You have been logged in successfully.",
    });
    navigate('/');
  };

  const handleMFACancel = () => {
    console.log('❌ MFA verification cancelled');
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

  console.log('🎯 AuthPage render state:', { 
    showMFA, 
    mfaEmail, 
    isLogin,
    debugInfo
  });

  // Show MFA verification if needed
  if (showMFA && mfaEmail) {
    console.log('🔐 Rendering MFA verification component for:', mfaEmail);
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 flex items-center justify-center p-4">
          <MfaVerification
            email={mfaEmail}
            onSuccess={handleMFASuccess}
            onCancel={handleMFACancel}
          />
        </div>
      </div>
    );
  }

  console.log('📝 Rendering auth form');
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <AuthForm
            isLogin={isLogin}
            isLoading={isLoading}
            showPassword={showPassword}
            showForgotPassword={showForgotPassword}
            formData={formData}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onInputChange={handleInputChange}
            onSubmit={handleFormSubmit}
            onForgotPassword={handleForgotPassword}
            onSwitchMode={handleSwitchMode}
          />
          
          {/* Debug panel - remove this after fixing */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-3 rounded text-xs">
              <h4 className="font-bold mb-2">Debug Info:</h4>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              <p className="mt-2">
                <strong>Session Storage:</strong> {sessionStorage.getItem('mfa_session_data') ? 'Has data' : 'Empty'}
              </p>
              <p>
                <strong>Show MFA:</strong> {showMFA ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
