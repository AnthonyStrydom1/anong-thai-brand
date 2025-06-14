
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminLink from './AdminLink';

interface UserMenuProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  translations: {
    login: string;
    profile: string;
    logout: string;
    account: string;
    orders: string;
    settings: string;
  };
}

const UserMenu = ({
  isLoggedIn,
  onLogout,
  translations
}: UserMenuProps) => {
  const { signIn, signUp, resetPassword } = useAuth();
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-open login modal on mobile when not logged in
  useEffect(() => {
    if (isMobile && !isLoggedIn && window.location.pathname === '/account') {
      setShowLoginModal(true);
    }
  }, [isMobile, isLoggedIn]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      // If not logged in, immediately show login modal
      setShowLoginModal(true);
    } else {
      // If logged in, show dropdown menu
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLoginClick = () => {
    setIsDropdownOpen(false);
    setShowLoginModal(true);
  };

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

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <>
      <DropdownMenu open={isLoggedIn ? isDropdownOpen : false} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white hover:bg-opacity-20 transition-colors"
            aria-label={isLoggedIn ? translations.profile : translations.login}
            onClick={handleTriggerClick}
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        
        {isLoggedIn && (
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full cursor-pointer">
                {translations.profile}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/account" className="w-full cursor-pointer">
                {translations.account}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/orders" className="w-full cursor-pointer">
                {translations.orders}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full cursor-pointer">
                {translations.settings}
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              {translations.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* Auth Modal */}
      <Dialog open={showLoginModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
            <DialogDescription>
              {isSignUp 
                ? 'Create your account to start shopping with Anong Thai.'
                : 'Enter your credentials to access your account dashboard.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuthSubmit}>
            <div className="grid gap-4 py-4">
              {isSignUp && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (showForgotPassword) setShowForgotPassword(false);
                  }}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (showForgotPassword) setShowForgotPassword(false);
                  }}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Forgot Password Section */}
              {!isSignUp && showForgotPassword && (
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
            </div>
            
            <DialogFooter className="flex-col space-y-2">
              <Button 
                type="submit" 
                className="bg-anong-gold hover:bg-anong-gold/90 text-anong-black w-full font-serif"
                disabled={isLoading || !email || !password}
              >
                {isLoading 
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
                className="w-full"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Create one"
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
