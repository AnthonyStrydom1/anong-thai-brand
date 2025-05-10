
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  navItems: { path: string; label: string }[];
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
  if (!isOpen) return null;

  // Common button style for mobile menu links
  const buttonStyle = "text-left w-full py-3 px-4 hover:bg-thai-purple hover:text-white transition-colors";

  return (
    <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-30 animate-in fade-in">
      <nav className="flex flex-col">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className="py-3 px-4 border-b border-gray-100 hover:bg-thai-purple hover:text-white transition-colors"
            onClick={onMenuItemClick}
          >
            {item.label}
          </Link>
        ))}
        
        <Button
          variant="ghost"
          className={buttonStyle}
          onClick={onSearchClick}
        >
          <div className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            {translations.search}
          </div>
        </Button>
        
        {isLoggedIn ? (
          <>
            <Button
              variant="ghost"
              className={buttonStyle}
              onClick={onMenuItemClick}
              asChild
            >
              <Link to="/profile">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  {translations.profile}
                </div>
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={buttonStyle}
              onClick={onLogoutClick}
            >
              <div className="flex items-center">
                {translations.logout}
              </div>
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className={buttonStyle}
            onClick={onLoginClick}
          >
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              {translations.login}
            </div>
          </Button>
        )}
        
        <Button
          variant="ghost"
          className={buttonStyle}
          onClick={onMenuItemClick}
          asChild
        >
          <Link to="/cart">
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              {translations.myCart}
            </div>
          </Link>
        </Button>
      </nav>
    </div>
  );
};

export default MobileMenu;
