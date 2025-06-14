
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import UserMenuButton from './UserMenuButton';
import UserMenuDropdown from './UserMenuDropdown';
import AuthModal from './AuthModal';
import { useAuthModal } from '@/hooks/useAuthModal';
import { mfaAuthService } from '@/services/mfaAuthService';
import { useAuth } from '@/hooks/useAuth';

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
  isLoggedIn: isLoggedInProp,
  onLogout,
  translations
}: UserMenuProps) => {
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [hasPendingMFA, setHasPendingMFA] = useState(false);
  
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

  const { user, session } = useAuth();

  // Use session and user for more reliable auth state - ignore mfaPending after successful login
  const isLoggedIn = !!(user && session);

  console.log('🎯 UserMenu: Auth state check:', { 
    user: !!user, 
    session: !!session,
    isLoggedInProp,
    finalIsLoggedIn: isLoggedIn,
    currentPath: window.location.pathname
  });

  // Clear MFA state when user logs in successfully
  useEffect(() => {
    if (isLoggedIn) {
      console.log('🧹 UserMenu: User logged in, clearing any MFA state');
      if (hasPendingMFA) {
        setHasPendingMFA(false);
        mfaAuthService.clearMFASession();
      }
    }
  }, [isLoggedIn, hasPendingMFA]);

  // Check for pending MFA status only when needed
  useEffect(() => {
    const checkMFAStatus = () => {
      // If user is logged in, no MFA should be pending
      if (isLoggedIn) {
        return;
      }
      
      // Only check MFA if we're on the auth page
      if (window.location.pathname !== '/auth') {
        if (hasPendingMFA) {
          console.log('🧹 UserMenu: Not on auth page, clearing MFA state');
          setHasPendingMFA(false);
        }
        return;
      }
      
      const pendingMFA = mfaAuthService.hasPendingMFA();
      console.log('🔍 UserMenu: MFA Status Check:', { 
        pendingMFA, 
        isLoggedIn, 
        currentPath: window.location.pathname,
        currentState: hasPendingMFA
      });
      
      // Only update state if it actually changed
      if (pendingMFA !== hasPendingMFA) {
        setHasPendingMFA(pendingMFA);
      }
    };

    // Check immediately
    checkMFAStatus();
    
    // Listen for MFA session events
    const handleMFAStored = () => {
      console.log('📧 UserMenu: MFA session stored');
      if (!isLoggedIn && window.location.pathname === '/auth') {
        setHasPendingMFA(true);
      }
    };

    const handleMFACleared = () => {
      console.log('🧹 UserMenu: MFA session cleared');
      setHasPendingMFA(false);
    };

    window.addEventListener('mfa-session-stored', handleMFAStored);
    window.addEventListener('mfa-session-cleared', handleMFACleared);

    return () => {
      window.removeEventListener('mfa-session-stored', handleMFAStored);
      window.removeEventListener('mfa-session-cleared', handleMFACleared);
    };
  }, [isLoggedIn, hasPendingMFA]);

  // Auto-open login modal on mobile when not logged in (only for /account route)
  useEffect(() => {
    if (isMobile && !isLoggedIn && !hasPendingMFA && window.location.pathname === '/account') {
      setShowLoginModal(true);
    }
  }, [isMobile, isLoggedIn, hasPendingMFA, setShowLoginModal]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ UserMenu: Button clicked', { 
      isLoggedIn, 
      hasPendingMFA, 
      currentPath: window.location.pathname 
    });
    
    // If user is logged in, show dropdown menu
    if (isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }
    
    // Don't interfere if we're on the auth page - let auth page handle everything
    if (window.location.pathname === '/auth') {
      console.log('🔄 UserMenu: On auth page, doing nothing');
      return;
    }
    
    // If not logged in and not on auth page, handle navigation
    if (isMobile) {
      window.location.href = '/auth';
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Clear any MFA session on logout
    mfaAuthService.clearMFASession();
    setHasPendingMFA(false);
    onLogout();
  };

  console.log('🎯 UserMenu render state:', { 
    isLoggedIn, 
    hasPendingMFA, 
    shouldShowDropdown: isLoggedIn,
    currentPath: window.location.pathname
  });

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
