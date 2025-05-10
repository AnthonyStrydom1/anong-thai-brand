
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, Search, X } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import CartDropdown from './CartDropdown';
import NavigationBanner from './NavigationBanner';
import SearchOverlay from './SearchOverlay';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';
import HeaderNav from './HeaderNav';
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  currentLanguage: 'en' | 'th';
  toggleLanguage: () => void;
}

const Header = ({ currentLanguage, toggleLanguage }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language } = useLanguage();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({
      title: translations[language].loginSuccess,
      description: translations[language].welcomeBack,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: translations[language].logoutSuccess,
    });
  };

  const translations = {
    en: {
      search: "Search",
      loginSuccess: "Successfully logged in",
      logoutSuccess: "Successfully logged out",
      welcomeBack: "Welcome back to Anong Thai!"
    },
    th: {
      search: "ค้นหา",
      loginSuccess: "เข้าสู่ระบบสำเร็จ",
      logoutSuccess: "ออกจากระบบสำเร็จ",
      welcomeBack: "ยินดีต้อนรับกลับสู่อนงค์ไทย!"
    }
  };

  const t = translations[language];

  return (
    <>
      <NavigationBanner />
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="mr-8">
                <h1 className="text-2xl font-bold text-[#520F7A]">
                  Anong Thai
                </h1>
              </Link>
              
              <HeaderNav />
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={toggleLanguage}
                className="font-bold"
              >
                {currentLanguage === 'en' ? 'TH' : 'EN'}
              </Button>
              
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleSearch}
                  aria-label={t.search}
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <UserDropdown />
                
                <CartDropdown />
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Search overlay */}
          <SearchOverlay 
            isOpen={isSearchOpen}
            onClose={toggleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Mobile menu */}
        <MobileMenu 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSearchOpen={() => setIsSearchOpen(true)}
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </header>
    </>
  );
};

export default Header;
