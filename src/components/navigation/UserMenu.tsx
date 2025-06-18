
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DropdownMenu } from "@/components/ui/dropdown-menu";
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

const UserMenu = ({ isLoggedIn: isLoggedInProp, onLogout, translations }: UserMenuProps) => {
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const authModal = useAuthModal();
  const { user, session, mfaPending, isLoading: authLoading } = useAuth();

  // Enhanced authentication state with stability checks
  const isLoggedIn = !!(user && session && !mfaPending && !authLoading);

  console.log('🎯 UserMenu: Auth state:', { 
    user: !!user, 
    session: !!session,
    mfaPending,
    authLoading,
    isLoggedIn,
    currentPath: window.location.pathname
  });

  // Auto-close dropdown on auth state changes
  useEffect(() => {
    if (!isLoggedIn && isDropdownOpen) {
      console.log('🔒 UserMenu: Closing dropdown - auth state changed');
      setIsDropdownOpen(false);
    }
  }, [isLoggedIn, isDropdownOpen]);

  // Auto-open modal for mobile /account access
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (isMobile && !isLoggedIn && currentPath === '/account') {
      console.log('📱 UserMenu: Auto-opening login for mobile /account');
      authModal.setShowLoginModal(true);
    }
  }, [isMobile, isLoggedIn, authModal.setShowLoginModal]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🖱️ UserMenu: Button clicked:', { 
      isLoggedIn,
      currentPath: window.location.pathname,
      mfaPending
    });
    
    if (isLoggedIn) {
      console.log('✅ UserMenu: Toggling dropdown for authenticated user');
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }
    
    // Don't interfere with auth page
    if (window.location.pathname === '/auth') {
      console.log('🔄 UserMenu: On auth page, no action needed');
      return;
    }
    
    // Handle MFA pending state
    if (mfaPending) {
      console.log('🔐 UserMenu: MFA pending, redirecting to auth');
      window.location.href = '/auth';
      return;
    }
    
    console.log('❌ UserMenu: User not authenticated, handling login');
    
    if (isMobile) {
      console.log('📱 UserMenu: Mobile - redirecting to /auth');
      window.location.href = '/auth';
    } else {
      console.log('💻 UserMenu: Desktop - showing modal');
      authModal.setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    console.log('🚪 UserMenu: Logout initiated');
    setIsDropdownOpen(false);
    mfaAuthService.clearMFASession();
    onLogout();
  };

  const shouldShowDropdown = isLoggedIn && isDropdownOpen;

  return (
    <>
      <DropdownMenu open={shouldShowDropdown} onOpenChange={(open) => {
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
          showModal={authModal.showLoginModal}
          isSignUp={authModal.isSignUp}
          showForgotPassword={authModal.showForgotPassword}
          email={authModal.email}
          password={authModal.password}
          firstName={authModal.firstName}
          lastName={authModal.lastName}
          isLoading={authModal.isLoading}
          onClose={authModal.handleCloseModal}
          onToggleSignUp={() => authModal.setIsSignUp(!authModal.isSignUp)}
          onSubmit={authModal.handleAuthSubmit}
          onEmailChange={authModal.handleEmailChange}
          onPasswordChange={authModal.handlePasswordChange}
          onFirstNameChange={authModal.setFirstName}
          onLastNameChange={authModal.setLastName}
          onForgotPassword={authModal.handleForgotPassword}
        />
      )}
    </>
  );
};

export default UserMenu;
