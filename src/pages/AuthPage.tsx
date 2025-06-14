
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import NavigationBanner from '@/components/NavigationBanner';
import { mfaAuthService } from '@/services/mfaAuthService';
import MfaVerification from '@/components/auth/MfaVerification';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const { signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Check for pending MFA on component mount
  useEffect(() => {
    if (mfaAuthService.hasPendingMFA()) {
      setShowMFA(true);
    }
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginAttempted(true);

    try {
      if (isLogin) {
        // Use MFA service for login
        const result = await mfaAuthService.initiateSignIn({
          email: formData.email,
          password: formData.password
        });

        if (result.mfaRequired) {
          setShowMFA(true);
          toast({
            title: "MFA Required",
            description: "Please check your email for the verification code.",
          });
        }
      } else {
        await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        setIsLogin(true);
      }
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive"
      });
      
      // Show forgot password option for login failures
      if (isLogin && error.message?.includes('Invalid login credentials')) {
        setShowForgotPassword(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFASuccess = () => {
    setShowMFA(false);
    toast({
      title: "Success!",
      description: "You have been logged in successfully.",
    });
    navigate('/');
  };

  const handleMFACancel = () => {
    setShowMFA(false);
    mfaAuthService.clearMFASession?.();
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

  // Show MFA verification if needed
  if (showMFA) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavigationBanner />
        <div className="flex-1 flex items-center justify-center p-4">
          <MfaVerification
            email={mfaAuthService.getPendingMFAEmail() || ''}
            onSuccess={handleMFASuccess}
            onCancel={handleMFACancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Welcome back! Please sign in to your account.' 
                : 'Create a new account to get started.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>First Name</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Last Name</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Section */}
              {isLogin && showForgotPassword && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">
                    Forgot your password? We can help you reset it.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Send Reset Email
                  </Button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={isLogin ? switchToSignUp : switchToLogin}
                  disabled={isLoading}
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
