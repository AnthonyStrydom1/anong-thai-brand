
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthModalProps {
  showModal: boolean;
  isSignUp: boolean;
  showForgotPassword: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isLoading: boolean;
  onClose: () => void;
  onToggleSignUp: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onForgotPassword: () => void;
}

const AuthModal = ({
  showModal,
  isSignUp,
  showForgotPassword,
  email,
  password,
  firstName,
  lastName,
  isLoading,
  onClose,
  onToggleSignUp,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onForgotPassword,
}: AuthModalProps) => {
  return (
    <Dialog open={showModal} onOpenChange={onClose}>
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
        
        <form onSubmit={onSubmit}>
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
                    onChange={(e) => onFirstNameChange(e.target.value)}
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
                    onChange={(e) => onLastNameChange(e.target.value)}
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
                onChange={(e) => onEmailChange(e.target.value)}
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
                onChange={(e) => onPasswordChange(e.target.value)}
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
                  onClick={onForgotPassword}
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
              onClick={onToggleSignUp}
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
  );
};

export default AuthModal;
