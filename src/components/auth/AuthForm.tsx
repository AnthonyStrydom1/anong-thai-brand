
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { mfaAuthService } from '@/services/mfaAuthService';

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  showPassword: boolean;
  showForgotPassword: boolean;
  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  onTogglePassword: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onSwitchMode: () => void;
}

const AuthForm = ({
  isLogin,
  isLoading,
  showPassword,
  showForgotPassword,
  formData,
  onTogglePassword,
  onInputChange,
  onSubmit,
  onForgotPassword,
  onSwitchMode
}: AuthFormProps) => {
  // Check for pending MFA for debug purposes
  const hasPendingMFA = mfaAuthService.hasPendingMFA();
  const pendingEmail = mfaAuthService.getPendingMFAEmail();

  const handleCheckMFA = () => {
    console.log('MFA Debug Check:');
    console.log('Has pending MFA:', mfaAuthService.hasPendingMFA());
    console.log('Pending email:', mfaAuthService.getPendingMFAEmail());
    console.log('Session storage MFA key:', sessionStorage.getItem('mfa_session_data'));
    console.log('Session storage challenge key:', sessionStorage.getItem('mfa_challenge_id'));
    
    // Force reload the page to trigger MFA check
    window.location.reload();
  };

  return (
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
        {/* Debug section for MFA */}
        {(hasPendingMFA || pendingEmail) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Debug Info:</strong> Pending MFA verification detected
            </p>
            <p className="text-xs text-yellow-700 mb-2">
              Email: {pendingEmail || 'No email found'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCheckMFA}
              className="w-full"
            >
              Check MFA Status & Reload
            </Button>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
              onChange={onInputChange}
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
                onChange={onInputChange}
                required
                disabled={isLoading}
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={onTogglePassword}
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
                onClick={onForgotPassword}
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
              onClick={onSwitchMode}
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
  );
};

export default AuthForm;
