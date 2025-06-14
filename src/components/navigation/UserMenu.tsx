
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import UserMenuButton from './UserMenuButton';
import UserMenuDropdown from './UserMenuDropdown';
import AuthModal from './AuthModal';
import { useAuthModal } from '@/hooks/useAuthModal';

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

  // Auto-open login modal on mobile when not logged in
  useEffect(() => {
    if (isMobile && !isLoggedIn && window.location.pathname === '/account') {
      setShowLoginModal(true);
    }
  }, [isMobile, isLoggedIn, setShowLoginModal]);

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

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

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

      {/* Auth Modal */}
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
    </>
  );
};

export default UserMenu;
