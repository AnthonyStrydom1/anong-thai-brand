
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

  // Check for pending MFA status
  useEffect(() => {
    const checkMFAStatus = () => {
      const pendingMFA = mfaAuthService.hasPendingMFA();
      setHasPendingMFA(pendingMFA);
      
      console.log('🔍 UserMenu: MFA Status Check:', { pendingMFA, isLoggedIn });
    };

    // Check immediately and on auth state changes
    checkMFAStatus();
    
    // Listen for MFA session events
    const handleMFAStored = () => {
      console.log('📧 UserMenu: MFA session stored');
      setHasPendingMFA(true);
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

  // Show different states based on auth and MFA status
  const shouldShowAsLoggedOut = !isLoggedIn || hasPendingMFA;

  return (
    <>
      <DropdownMenu open={isLoggedIn && !hasPendingMFA ? isDropdownOpen : false} onOpenChange={setIsDropdownOpen}>
        <UserMenuButton 
          isLoggedIn={!shouldShowAsLoggedOut}
          onClick={handleTriggerClick}
          translations={translations}
        />
        
        {isLoggedIn && !hasPendingMFA && (
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
