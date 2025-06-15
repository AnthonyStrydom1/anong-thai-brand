
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function useAuthPageLogic() {
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

  const { user, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect authenticated users away from auth page
  useEffect(() => {
    if (user) {
      console.log('✅ Auth: User is authenticated, redirecting from auth page');
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (showForgotPassword) {
      setShowForgotPassword(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;

    setIsLoading(true);
    
    try {
      if (isLogin) {
        console.log('🔐 Auth Page: Attempting direct sign in');
        await signIn(formData.email, formData.password);
        
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        
        // Navigation will happen automatically via useEffect above
      } else {
        console.log('📝 Auth Page: Attempting sign up');
        await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
        
        toast({
          title: "Account Created!",
          description: "Welcome to Anong Thai Brand. You have been logged in automatically.",
        });
        
        // Navigation will happen automatically via useEffect above
      }
    } catch (error: any) {
      console.error('❌ Auth Page: Authentication error:', error);
      toast({
        title: isLogin ? "Sign In Failed" : "Sign Up Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
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
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error('❌ Auth Page: Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setShowForgotPassword(false);
    setFormData(prev => ({ ...prev, firstName: '', lastName: '' }));
  };

  // No MFA-related state or handlers needed
  return {
    isLogin,
    isLoading,
    showPassword,
    showForgotPassword,
    formData,
    setShowPassword,
    handleFormSubmit,
    handleForgotPassword,
    handleInputChange,
    handleSwitchMode,
    // MFA-related properties set to false/null for compatibility
    showMFA: false,
    mfaEmail: null,
    isCheckingMFA: false,
    mfaPending: false,
    handleMFASuccess: () => {},
    handleMFACancel: () => {}
  };
}
