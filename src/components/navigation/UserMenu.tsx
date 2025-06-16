
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  // Enhanced authentication state detection with mobile-specific handling
  const isLoggedIn = !!(user && session && !mfaPending && !authLoading);

  console.log('🎯 UserMenu: Auth state check:', { 
    user: !!user, 
    session: !!session,
    mfaPending,
    authLoading,
    finalIsLoggedIn: isLoggedIn,
    currentPath: window.location.pathname,
    isMobile
  });

  // Auto-close dropdown when auth state changes
  useEffect(() => {
    if (!isLoggedIn && isDropdownOpen) {
      console.log('🔒 UserMenu: Closing dropdown due to auth state change');
      setIsDropdownOpen(false);
    }
  }, [isLoggedIn, isDropdownOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ UserMenu: Button clicked - Auth state:', { 
      isLoggedIn,
      user: !!user,
      session: !!session,
      mfaPending,
      authLoading,
      currentPath: window.location.pathname,
      isMobile
    });
    
    // If user is logged in, show dropdown menu
    if (isLoggedIn) {
      console.log('✅ UserMenu: User is logged in, toggling dropdown');
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }
    
    // Don't interfere if we're on the auth page or MFA is pending
    if (window.location.pathname === '/auth' || mfaPending) {
      console.log('🔄 UserMenu: On auth page or MFA pending, doing nothing');
      return;
    }
    
    console.log('❌ UserMenu: User not logged in, handling login flow');
    
    // For both mobile and desktop, show the login modal
    console.log('🔐 UserMenu: Opening login modal');
    setShowLoginModal(true);
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
    currentPath: window.location.pathname,
    isMobile
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

      {/* Auth Modal - show for both mobile and desktop when not logged in */}
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
