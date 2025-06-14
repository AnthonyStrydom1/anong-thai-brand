
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import UserMenuButton from './UserMenuButton';
import UserMenuDropdown from './UserMenuDropdown';
import AuthModal from './AuthModal';
import { useAuthModal } from '@/hooks/useAuthModal';
import { mfaAuthService } from '@/services/mfaAuthService';

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
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [hasPendingMFA, setHasPendingMFA] = useState(false);
  const [isCheckingMFA, setIsCheckingMFA] = useState(true);
  
  const {
    showLoginModal,
    setShowLoginModal,
    isSignUp,
    setIsSignUp,
    showForgotPassword,
    email,
    password,
    firstName,
    lastName,
    isLoading,
    handleAuthSubmit,
    handleForgotPassword,
    handleCloseModal,
    handleEmailChange,
    handlePasswordChange,
    setFirstName,
    setLastName,
  } = useAuthModal();

  // Check for pending MFA on mount and auth state changes
  useEffect(() => {
    const checkMFAStatus = () => {
      console.log('🔍 UserMenu: Checking MFA status...');
      const pendingMFA = mfaAuthService.hasPendingMFA();
      const pendingEmail = mfaAuthService.getPendingMFAEmail();
      
      console.log('📊 UserMenu: MFA Status:', { pendingMFA, pendingEmail, isLoggedIn });
      
      setHasPendingMFA(pendingMFA);
      setIsCheckingMFA(false);
      
      // If we have pending MFA and we're not logged in, show the login modal
      if (pendingMFA && pendingEmail && !isLoggedIn) {
        console.log('🚨 UserMenu: Pending MFA detected, should redirect to AuthPage');
        // Don't auto-open modal here, let AuthPage handle it
      }
    };

    checkMFAStatus();
  }, [isLoggedIn]);

  // Auto-open login modal on mobile when not logged in (only for /account route)
  useEffect(() => {
    if (isMobile && !isLoggedIn && !hasPendingMFA && window.location.pathname === '/account') {
      setShowLoginModal(true);
    }
  }, [isMobile, isLoggedIn, hasPendingMFA, setShowLoginModal]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ UserMenu: Button clicked', { isLoggedIn, hasPendingMFA });
    
    // If we have pending MFA, redirect to auth page
    if (hasPendingMFA) {
      console.log('🔄 UserMenu: Redirecting to auth page for MFA');
      window.location.href = '/auth';
      return;
    }
    
    if (!isLoggedIn) {
      // If not logged in, show login modal or redirect to auth page
      if (isMobile) {
        window.location.href = '/auth';
      } else {
        setShowLoginModal(true);
      }
    } else {
      // If logged in, show dropdown menu
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  // Don't render anything while checking MFA status to prevent flashing
  if (isCheckingMFA) {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // If there's pending MFA, show a different state
  if (hasPendingMFA) {
    return (
      <>
        <UserMenuButton 
          isLoggedIn={false}
          onClick={handleTriggerClick}
          translations={translations}
        />
        
        {/* Auth Modal - only show if not on auth page */}
        {!window.location.pathname.includes('/auth') && (
          <AuthModal
            showModal={showLoginModal}
            isSignUp={isSignUp}
            showForgotPassword={showForgotPassword}
            email={email}
            password={password}
            firstName={firstName}
            lastName={lastName}
            isLoading={isLoading}
            onClose={handleCloseModal}
            onToggleSignUp={() => setIsSignUp(!isSignUp)}
            onSubmit={handleAuthSubmit}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onForgotPassword={handleForgotPassword}
          />
        )}
      </>
    );
  }

  return (
    <>
      <DropdownMenu open={isLoggedIn ? isDropdownOpen : false} onOpenChange={setIsDropdownOpen}>
        <UserMenuButton 
          isLoggedIn={isLoggedIn}
          onClick={handleTriggerClick}
          translations={translations}
        />
        
        {isLoggedIn && (
          <UserMenuDropdown 
            onLogout={handleLogout}
            translations={translations}
          />
        )}
      </DropdownMenu>

      {/* Auth Modal - only show if not on auth page and no pending MFA */}
      {!window.location.pathname.includes('/auth') && !hasPendingMFA && (
        <AuthModal
          showModal={showLoginModal}
          isSignUp={isSignUp}
          showForgotPassword={showForgotPassword}
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          isLoading={isLoading}
          onClose={handleCloseModal}
          onToggleSignUp={() => setIsSignUp(!isSignUp)}
          onSubmit={handleAuthSubmit}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onForgotPassword={handleForgotPassword}
        />
      )}
    </>
  );
};

export default UserMenu;
