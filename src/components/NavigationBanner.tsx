
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

  return (
    <div className="bg-anong-dark-green nav-premium sticky top-0 z-40 border-b border-anong-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="mr-8 lg:mr-12">
              <h1 className="text-xl lg:text-2xl font-display font-light text-anong-cream tracking-wide">
                ANONG
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-serif text-sm tracking-wide transition-colors duration-300 ${
                    isActive(item.path)
                      ? 'text-anong-gold border-b border-anong-gold pb-1'
                      : 'text-anong-cream/80 hover:text-anong-gold'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="text-anong-cream/70 hover:text-anong-gold hover:bg-anong-cream/5 text-xs font-medium tracking-wider px-3 py-2 h-auto"
            >
              {language === 'en' ? 'TH' : 'EN'}
            </Button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSearch}
                aria-label={t.search}
                className="text-anong-cream/70 hover:text-anong-gold hover:bg-anong-cream/5"
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
              className="text-anong-cream/70 hover:text-anong-gold hover:bg-anong-cream/5 md:hidden" 
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
