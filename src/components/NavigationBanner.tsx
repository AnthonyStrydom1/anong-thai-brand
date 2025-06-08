
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, X } from "lucide-react";
import CartDropdown from './CartDropdown';
import CurrencySelector from './CurrencySelector';
import { toast } from "@/hooks/use-toast";
import NavItem from './navigation/NavItem';
import SearchOverlay from './navigation/SearchOverlay';
import MobileMenu from './navigation/MobileMenu';
import UserMenu from './navigation/UserMenu';
import { navigationTranslations } from '@/translations/navigation';

interface NavigationBannerProps {
  isLoggedIn: boolean;
  onLogin: (email?: string, password?: string) => void;
  onLogout: () => void;
}

const NavigationBanner = ({ isLoggedIn, onLogin, onLogout }: NavigationBannerProps) => {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Updated handleLogin - this now handles actual login with credentials
  const handleLogin = (email?: string, password?: string) => {
    // If called with credentials (from login form)
    if (email && password) {
      onLogin(email, password);
      toast({
        title: t.loginSuccess,
        description: t.welcomeBack,
      });
      return;
    }
    
    // If called without credentials, it means we want to open the login form
    // The UserMenu component will handle showing the login modal
    // This function will be called again WITH credentials when the form is submitted
  };

  const handleLogout = () => {
    onLogout();
    toast({
      title: t.logoutSuccess,
    });
  };
  
  const t = navigationTranslations[language];

  const navItems = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/about', label: language === 'en' ? 'About Anong' : 'เกี่ยวกับอนงค์' },
    { path: '/recipes', label: t.recipes },
    { path: '/contact', label: t.contact },
  ];

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bg-anong-black nav-premium sticky top-0 z-40 border-b border-anong-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="mr-8 lg:mr-12 flex items-center">
              <div className="w-8 h-8 mr-3">
                <img 
                  src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                  alt="ANONG Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl lg:text-2xl font-serif font-semibold text-anong-gold tracking-wide">
                ANONG
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-sans text-sm tracking-wide transition-colors duration-300 ${
                    isActive(item.path)
                      ? 'text-anong-gold border-b border-anong-gold pb-1'
                      : 'text-white/80 hover:text-anong-gold'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <CurrencySelector />
            
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="text-white/70 hover:text-anong-gold hover:bg-white/5 text-xs font-medium tracking-wider px-3 py-2 h-auto"
            >
              {language === 'en' ? 'TH' : 'EN'}
            </Button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSearch}
                aria-label={t.search}
                className="text-white/70 hover:text-anong-gold hover:bg-white/5"
              >
                <Search className="h-4 w-4" />
              </Button>
              
              <UserMenu 
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                onLogout={handleLogout}
                translations={t}
              />
              
              <CartDropdown />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/70 hover:text-anong-gold hover:bg-white/5 md:hidden" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Search overlay */}
        <SearchOverlay 
          isOpen={isSearchOpen}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onClear={handleClearSearch}
          onClose={toggleSearch}
          translations={t}
        />
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        onMenuItemClick={() => setIsMenuOpen(false)}
        onSearchClick={toggleSearch}
        onLoginClick={handleLogin}
        onLogoutClick={handleLogout}
        translations={t}
      />
    </div>
  );
};

export default NavigationBanner;
