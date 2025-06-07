import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginModal from './LoginModal'; // Import the LoginModal component

interface UserMenuProps {
  isLoggedIn: boolean;
  onLogin: (email: string, password: string) => void; // Updated to accept credentials
  onLogout: () => void;
  translations: {
    login: string;
    profile: string;
    logout: string;
    account: string;
    orders: string;
    settings: string;
    email: string;
    password: string;
    loginButton: string;
    cancel: string;
    loginTitle: string;
    loginDescription: string;
  };
}

const UserMenu = ({
  isLoggedIn,
  onLogin,
  onLogout,
  translations
}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Common style for consistent white box highlighting
  const buttonStyle = "text-white hover:bg-white hover:bg-opacity-20 transition-colors";

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    setIsOpen(false); // Close dropdown
    setShowLoginModal(true); // Open login modal
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    try {
      await onLogin(email, password);
      setShowLoginModal(false);
    } catch (error) {
      // Handle login error (you might want to show an error message)
      console.error('Login failed:', error);
      throw error; // Re-throw to let the modal handle it
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={buttonStyle}
            aria-label={isLoggedIn ? translations.profile : translations.login}
            onClick={handleTriggerClick}
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          {isLoggedIn ? (
            <>
              <DropdownMenuItem asChild>
                <Link to="/profile" className="w-full cursor-pointer">
                  {translations.profile}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/account" className="w-full cursor-pointer">
                  {translations.account}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/orders" className="w-full cursor-pointer">
                  {translations.orders}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/settings" className="w-full cursor-pointer">
                  {translations.settings}
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                {translations.logout}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={handleLoginClick} className="cursor-pointer">
                {translations.login}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/account" className="w-full cursor-pointer">
                  {translations.account}
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSubmit}
        translations={translations}
      />
    </>
  );
};

export default UserMenu;