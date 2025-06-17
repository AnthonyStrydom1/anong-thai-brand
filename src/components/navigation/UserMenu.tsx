
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

  const { user, session, mfaPending, isLoading: authLoading } = useAuth();

  // Enhanced authentication state detection with more stable logic
  const isLoggedIn = !!(user && session && !mfaPending && !authLoading);

  console.log('🎯 UserMenu: Auth state check:', { 
    user: !!user, 
    session: !!session,
    mfaPending,
    authLoading,
    finalIsLoggedIn: isLoggedIn,
    currentPath: window.location.pathname
  });

  // Auto-close dropdown when auth state changes
  useEffect(() => {
    if (!isLoggedIn && isDropdownOpen) {
      console.log('🔒 UserMenu: Closing dropdown due to auth state change');
      setIsDropdownOpen(false);
    }
  }, [isLoggedIn, isDropdownOpen]);

  // Don't auto-open modal on mobile for /account - let the page handle it
  // This prevents conflicts between modal and full auth page
  useEffect(() => {
    const currentPath = window.location.pathname;
    // Only auto-open if we're on /account but NOT already on /auth
    if (isMobile && !isLoggedIn && currentPath === '/account' && currentPath !== '/auth') {
      console.log('📱 UserMenu: Auto-opening login modal for mobile /account access');
      setShowLoginModal(true);
    }
  }, [isMobile, isLoggedIn, setShowLoginModal]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ UserMenu: Button clicked - Auth state:', { 
      isLoggedIn,
      user: !!user,
      session: !!session,
      mfaPending,
      authLoading,
      currentPath: window.location.pathname
    });
    
    // If user is logged in, show dropdown menu
    if (isLoggedIn) {
      console.log('✅ UserMenu: User is logged in, toggling dropdown');
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }
    
    // Don't interfere if we're on the auth page - let auth page handle everything
    if (window.location.pathname === '/auth') {
      console.log('🔄 UserMenu: On auth page, doing nothing');
      return;
    }
    
    // Don't interfere if MFA is pending - let the auth flow handle it
    if (mfaPending) {
      console.log('🔐 UserMenu: MFA pending, redirecting to auth page');
      window.location.href = '/auth';
      return;
    }
    
    console.log('❌ UserMenu: User not logged in, handling navigation');
    
    // If not logged in and not on auth page, handle navigation
    if (isMobile) {
      console.log('📱 UserMenu: Mobile - redirecting to /auth');
      window.location.href = '/auth';
    } else {
      console.log('💻 UserMenu: Desktop - showing login modal');
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    console.log('🚪 UserMenu: Logout initiated');
    setIsDropdownOpen(false);
    // Clear any MFA session on logout
    mfaAuthService.clearMFASession();
    onLogout();
  };

  // Prevent dropdown from opening when not authenticated
  const shouldShowDropdown = isLoggedIn && isDropdownOpen;

  console.log('🎯 UserMenu render decision:', { 
    isLoggedIn, 
    isDropdownOpen,
    shouldShowDropdown,
    mfaPending,
    authLoading,
    currentPath: window.location.pathname
  });

  return (
    <>
      <DropdownMenu open={shouldShowDropdown} onOpenChange={(open) => {
        // Only allow opening if user is authenticated
        if (isLoggedIn) {
          setIsDropdownOpen(open);
        } else {
          setIsDropdownOpen(false);
        }
      }}>
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
      {!window.location.pathname.includes('/auth') && !mfaPending && (
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
