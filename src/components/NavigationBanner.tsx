
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, X } from "lucide-react";
import CartDropdown from './CartDropdown';
import { toast } from "@/components/ui/use-toast";
import NavItem from './navigation/NavItem';
import SearchOverlay from './navigation/SearchOverlay';
import MobileMenu from './navigation/MobileMenu';
import UserMenu from './navigation/UserMenu';
import { navigationTranslations } from '@/translations/navigation';

const NavigationBanner = () => {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({
      title: t.loginSuccess,
      description: t.welcomeBack,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: t.logoutSuccess,
    });
  };
  
  const t = navigationTranslations[language];

  const navItems = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/recipes', label: t.recipes },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact },
  ];

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  // Common button style for consistent white box highlighting
  const buttonStyle = "text-white hover:bg-white hover:bg-opacity-20 transition-colors";

  return (
      {/* Add a thin decorative gold line along the top */}
      <div className="h-1 bg-gradient-to-r from-thai-gold/20 via-thai-gold to-thai-gold/20"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="mr-4 lg:mr-8">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Anong Thai
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <NavItem 
                  key={item.path}
                  path={item.path}
                  label={item.label}
                  isActive={isActive(item.path)}
                />
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className={buttonStyle + " font-bold"}
            >
              {language === 'en' ? 'TH' : 'EN'}
            </Button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSearch}
                aria-label={t.search}
                className={buttonStyle}
              >
                <Search className="h-5 w-5" />
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
              className={buttonStyle + " md:hidden"} 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
      
      {/* Add a thin decorative gold line along the bottom */}
      <div className="h-0.5 bg-gradient-to-r from-thai-gold/20 via-thai-gold to-thai-gold/20"></div>
    </div>
  );
};

export default NavigationBanner;
