
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuthModal from './AuthModal';
import { useAuthModal } from '@/hooks/useAuthModal';
import { mfaAuthService } from '@/services/mfaAuthService';
import { AuthContext } from '@/hooks/auth/AuthProvider';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: Array<{ path: string; label: string }>;
  isLoggedIn: boolean;
  onMenuItemClick: () => void;
  onSearchClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  translations: {
    search: string;
    login: string;
    profile: string;
    logout: string;
    myCart: string;
    account: string;
    orders: string;
    settings: string;
  };
}

const MobileMenu = ({
  isOpen,
  navItems,
  isLoggedIn,
  onMenuItemClick,
  onSearchClick,
  onLoginClick,
  onLogoutClick,
  translations
}: MobileMenuProps) => {
  // Check if AuthContext is available
  const authContext = useContext(AuthContext);
  
  // Only use useAuthModal if auth context is available
  const authModalHook = authContext ? useAuthModal() : {
    showLoginModal: false,
    setShowLoginModal: () => {},
    isSignUp: false,
    setIsSignUp: () => {},
    showForgotPassword: false,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isLoading: false,
    handleAuthSubmit: async () => {},
    handleForgotPassword: async () => {},
    handleCloseModal: () => {},
    handleEmailChange: () => {},
    handlePasswordChange: () => {},
    setFirstName: () => {},
    setLastName: () => {},
  };

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
  } = authModalHook;

  const handleLoginClick = () => {
    console.log('📱 MobileMenu: Login clicked');
    
    // If auth context is not available, use the parent's login handler
    if (!authContext) {
      console.log('📱 MobileMenu: No auth context, using parent login handler');
      onLoginClick();
      return;
    }
    
    setShowLoginModal(true);
    onMenuItemClick(); // Close the mobile menu
  };

  const handleLogoutClick = () => {
    console.log('📱 MobileMenu: Logout clicked');
    mfaAuthService.clearMFASession();
    onLogoutClick();
    onMenuItemClick(); // Close the mobile menu
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-anong-black border-t border-gray-800 md:hidden">
        <div className="container mx-auto px-4 py-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-2 px-3 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                onClick={onMenuItemClick}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-800 pt-4 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white hover:bg-opacity-10"
                onClick={() => {
                  onSearchClick();
                  onMenuItemClick();
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                {translations.search}
              </Button>
              
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 px-3 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                    onClick={onMenuItemClick}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    {translations.profile}
                  </Link>
                  <Link
                    to="/account"
                    className="block py-2 px-3 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                    onClick={onMenuItemClick}
                  >
                    {translations.account}
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 px-3 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                    onClick={onMenuItemClick}
                  >
                    {translations.orders}
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 px-3 text-white hover:bg-white hover:bg-opacity-10 rounded transition-colors"
                    onClick={onMenuItemClick}
                  >
                    {translations.settings}
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-400 hover:bg-red-400 hover:bg-opacity-10"
                    onClick={handleLogoutClick}
                  >
                    {translations.logout}
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white hover:bg-opacity-10"
                  onClick={handleLoginClick}
                >
                  <User className="h-4 w-4 mr-2" />
                  {translations.login}
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Auth Modal for mobile - only if auth context is available */}
      {authContext && !window.location.pathname.includes('/auth') && (
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

export default MobileMenu;
