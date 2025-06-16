
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { navigationTranslations } from '@/translations/navigation';
import LogoSection from './navigation/LogoSection';
import DesktopNav from './navigation/DesktopNav';
import RightActions from './navigation/RightActions';
import MobileMenu from './navigation/MobileMenu';
import SearchOverlay from './navigation/SearchOverlay';

const NavigationBanner = () => {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();
  const { selectedCurrency } = useCurrency();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Safely use auth hook with error boundary
  let authState;
  try {
    authState = useAuth();
  } catch (error) {
    console.warn('Auth context not available in NavigationBanner:', error);
    authState = {
      user: null,
      session: null,
      isLoading: true,
      mfaPending: false,
      signOut: async () => {}
    };
  }

  const { user, session, isLoading, mfaPending, signOut } = authState;

  // Enhanced mobile auth state detection
  const isLoggedIn = !!(user && session && !mfaPending && !isLoading);

  console.log('🧭 NavigationBanner: Auth state', { 
    user: !!user, 
    session: !!session,
    mfaPending,
    isLoading,
    isLoggedIn,
    isMobile,
    pathname: window.location.pathname
  });

  const handleLogout = async () => {
    console.log('🚪 NavigationBanner: Logout initiated');
    try {
      await signOut();
      console.log('✅ NavigationBanner: Logout successful');
      
      // For mobile, ensure we navigate to home after logout
      if (isMobile) {
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error('❌ NavigationBanner: Logout error:', error);
    }
  };

  const handleToggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  // Get navigation translations
  const t = navigationTranslations[language];

  // Navigation items
  const navItems = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/recipes', label: t.recipes },
    { path: '/events', label: t.events },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact }
  ];

  return (
    <>
      <header className="bg-anong-black shadow-lg relative z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <LogoSection />
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <DesktopNav navItems={navItems} />
            )}
            
            <RightActions
              language={language}
              isLoggedIn={isLoggedIn}
              isMenuOpen={isMenuOpen}
              onToggleLanguage={toggleLanguage}
              onToggleSearch={handleToggleSearch}
              onToggleMenu={handleToggleMenu}
              onLogout={handleLogout}
              translations={{
                search: t.search,
                account: t.account,
                orders: t.orders,
                settings: t.settings,
                profile: t.profile,
                login: t.login,
                logout: t.logout
              }}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          navItems={navItems}
          isLoggedIn={isLoggedIn}
          onMenuItemClick={() => setIsMenuOpen(false)}
          onSearchClick={handleToggleSearch}
          onLoginClick={() => navigate('/auth')}
          onLogoutClick={handleLogout}
          translations={{
            search: t.search,
            login: t.login,
            profile: t.profile,
            logout: t.logout,
            myCart: t.myCart,
            account: t.account,
            orders: t.orders,
            settings: t.settings
          }}
        />
      </header>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClear={handleSearchClear}
        onClose={() => setIsSearchOpen(false)}
        translations={{
          search: t.search,
          searchPlaceholder: language === 'th' ? 'ค้นหาสินค้า...' : 'Search products...'
        }}
      />
    </>
  );
};

export default NavigationBanner;
