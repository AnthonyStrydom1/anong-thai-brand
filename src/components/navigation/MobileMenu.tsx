
import { Link } from 'react-router-dom';
import { Search, LogIn, LogOut, ShoppingCart } from "lucide-react";
import { NavigationTranslation } from "@/translations/navigation";
import React from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  navItems: { path: string; label: string }[];
  isLoggedIn: boolean;
  onMenuItemClick: () => void;
  onSearchClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  translations: NavigationTranslation;
  NavButton: React.ComponentType<any>; // Add NavButton as a component prop
}

const MobileMenu = ({ 
  isOpen, 
  navItems, 
  isLoggedIn, 
  onMenuItemClick, 
  onSearchClick, 
  onLoginClick, 
  onLogoutClick,
  translations,
  NavButton
}: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden bg-[#631E8B] border-t border-thai-gold/30 animate-fade-in">
      <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className="text-white hover:text-thai-gold p-2 transition" 
            onClick={onMenuItemClick}
          >
            {item.label}
          </Link>
        ))}
        <hr className="border-thai-gold/30" />
        <div className="flex justify-between">
          <NavButton
            onClick={() => {
              onMenuItemClick();
              onSearchClick();
            }}
          >
            <Search className="h-4 w-4 mr-2" />
            {translations.search}
          </NavButton>
          {isLoggedIn ? (
            <NavButton
              onClick={onLogoutClick}
              className="text-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {translations.logout}
            </NavButton>
          ) : (
            <NavButton
              onClick={onLoginClick}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {translations.login}
            </NavButton>
          )}
          <Link to="/cart" onClick={onMenuItemClick}>
            <NavButton>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {translations.cart}
            </NavButton>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
