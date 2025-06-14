
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Menu, X } from "lucide-react";
import CartDropdown from '../CartDropdown';
import CurrencySelector from '../CurrencySelector';
import UserMenu from './UserMenu';

interface RightActionsProps {
  language: 'en' | 'th';
  isLoggedIn: boolean;
  isMenuOpen: boolean;
  onToggleLanguage: () => void;
  onToggleSearch: () => void;
  onToggleMenu: () => void;
  onLogout: () => void;
  translations: {
    search: string;
    account: string;
    orders: string;
    settings: string;
    profile: string;
    login: string;
    logout: string;
  };
}

const RightActions = ({
  language,
  isLoggedIn,
  isMenuOpen,
  onToggleLanguage,
  onToggleSearch,
  onToggleMenu,
  onLogout,
  translations
}: RightActionsProps) => {
  return (
    <div className="flex items-center space-x-3">
      <CurrencySelector />
      
      <Button 
        variant="ghost" 
        onClick={onToggleLanguage}
        className="text-white/70 hover:text-anong-gold hover:bg-white/5 text-xs font-medium tracking-wider px-3 py-2 h-auto"
      >
        {language === 'en' ? 'TH' : 'EN'}
      </Button>
      
      <div className="hidden md:flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleSearch}
          aria-label={translations.search}
          className="text-white/70 hover:text-anong-gold hover:bg-white/5"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <UserMenu 
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          translations={translations}
        />
        
        <CartDropdown />
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-white/70 hover:text-anong-gold hover:bg-white/5 md:hidden" 
        onClick={onToggleMenu}
      >
        {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default RightActions;
