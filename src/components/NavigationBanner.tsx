
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/use-toast";
import SearchOverlay from './navigation/SearchOverlay';
import MobileMenu from './navigation/MobileMenu';
import LogoSection from './navigation/LogoSection';
import DesktopNav from './navigation/DesktopNav';
import RightActions from './navigation/RightActions';
import { navigationTranslations } from '@/translations/navigation';

const NavigationBanner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { user, signOut, mfaPending } = useAuth();
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

  const handleLogout = async () => {
    try {
      console.log('🔄 NavigationBanner: Starting logout process');
      await signOut();
      console.log('✅ NavigationBanner: Logout successful');
      
      toast({
        title: t.logoutSuccess || 'Successfully logged out',
      });
      
      navigate('/');
      
    } catch (error: any) {
      console.error('❌ NavigationBanner: Unexpected logout error:', error);
      
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account',
      });
      
      navigate('/');
    }
  };

  const handleMobileLogin = () => {
    // This will be handled by the Link to /account in MobileMenu
    // which will show the login modal when not authenticated
  };
  
  const t = navigationTranslations[language];

  const navItems = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/about', label: language === 'en' ? 'About Anong' : 'เกี่ยวกับอนงค์' },
    { path: '/recipes', label: t.recipes },
    { path: '/contact', label: t.contact },
  ];

  // Enhanced mobile translations with all required properties
  const mobileTranslations = {
    ...t,
    account: t.account || (language === 'en' ? 'Account' : 'บัญชี'),
    orders: t.orders || (language === 'en' ? 'Orders' : 'คำสั่งซื้อ'),
    settings: t.settings || (language === 'en' ? 'Settings' : 'การตั้งค่า'),
  };

  useEffect(() => {
    if (mfaPending && currentPath !== '/auth') {
      navigate("/auth", { replace: true });
    }
  }, [mfaPending, currentPath, navigate]);

  // Update "isLoggedIn" logic to factor mfaPending
  const isLoggedIn = !!user && !mfaPending;

  return (
    <div className="bg-anong-black nav-premium sticky top-0 z-40 border-b border-anong-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <LogoSection />
            <DesktopNav navItems={navItems} />
          </div>

          {/* Right side actions */}
          <RightActions
            language={language}
            isLoggedIn={isLoggedIn}
            isMenuOpen={isMenuOpen}
            onToggleLanguage={toggleLanguage}
            onToggleSearch={toggleSearch}
            onToggleMenu={toggleMenu}
            onLogout={handleLogout}
            translations={mobileTranslations}
          />
        </div>

        {/* Search overlay */}
        <SearchOverlay 
          isOpen={isSearchOpen}
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onClear={handleClearSearch}
          onClose={toggleSearch}
          translations={mobileTranslations}
        />
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        onMenuItemClick={() => setIsMenuOpen(false)}
        onSearchClick={toggleSearch}
        onLoginClick={handleMobileLogin}
        onLogoutClick={handleLogout}
        translations={mobileTranslations}
      />
    </div>
  );
};

export default NavigationBanner;
