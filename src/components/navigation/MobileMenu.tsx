
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AdminLink from './AdminLink';

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
  if (!isOpen) return null;

  // Common button style for mobile menu links
  const buttonStyle = "text-left w-full py-3 px-4 hover:bg-anong-gold hover:text-anong-black transition-colors justify-start font-serif";

  return (
    <div className="md:hidden bg-anong-black shadow-lg absolute top-full left-0 w-full z-30 animate-in fade-in border-t border-anong-gold/20">
      <nav className="flex flex-col">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className="py-3 px-4 border-b border-anong-gold/10 hover:bg-anong-gold hover:text-anong-black transition-colors text-white font-serif"
            onClick={onMenuItemClick}
          >
            {item.label}
          </Link>
        ))}
        
        <Button
          variant="ghost"
          className={buttonStyle}
          onClick={() => {
            onSearchClick();
            onMenuItemClick();
          }}
        >
          <div className="flex items-center text-white">
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
                <div className="flex items-center text-white">
                  <User className="mr-2 h-5 w-5" />
                  {translations.profile}
                </div>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={buttonStyle}
              onClick={onMenuItemClick}
              asChild
            >
              <Link to="/account">
                <div className="flex items-center text-white">
                  <User className="mr-2 h-5 w-5" />
                  {translations.account}
                </div>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={buttonStyle}
              onClick={onMenuItemClick}
              asChild
            >
              <Link to="/orders">
                <div className="flex items-center text-white">
                  <User className="mr-2 h-5 w-5" />
                  {translations.orders}
                </div>
              </Link>
            </Button>
            
            <Button
              variant="ghost"
              className={buttonStyle}
              onClick={onMenuItemClick}
              asChild
            >
              <Link to="/settings">
                <div className="flex items-center text-white">
                  <User className="mr-2 h-5 w-5" />
                  {translations.settings}
                </div>
              </Link>
            </Button>
            
            {/* Admin Dashboard Link for Mobile */}
            <div className="border-b border-anong-gold/10">
              <AdminLink />
            </div>
            
            <Button
              variant="ghost"
              className={buttonStyle}
              onClick={() => {
                onLogoutClick();
                onMenuItemClick();
              }}
            >
              <div className="flex items-center text-white">
                {translations.logout}
              </div>
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            className={buttonStyle}
            onClick={onMenuItemClick}
            asChild
          >
            <Link to="/account">
              <div className="flex items-center text-white">
                <User className="mr-2 h-5 w-5" />
                {translations.login}
              </div>
            </Link>
          </Button>
        )}
        
        <Button
          variant="ghost"
          className={buttonStyle}
          onClick={onMenuItemClick}
          asChild
        >
          <Link to="/cart">
            <div className="flex items-center text-white">
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
