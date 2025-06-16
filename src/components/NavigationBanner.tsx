
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { navigationTranslations } from '@/translations/navigation';
import DesktopNav from './navigation/DesktopNav';
import MobileMenu from './navigation/MobileMenu';

const NavigationBanner = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { selectedCurrency } = useCurrency();
  const isMobile = useIsMobile();
  
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

  // Get navigation translations
  const t = navigationTranslations[language];

  // Navigation items for desktop
  const navItems = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/recipes', label: t.recipes },
    { path: '/events', label: t.events },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact }
  ];

  // Mobile navigation component
  if (isMobile) {
    return (
      <MobileMenu
        isOpen={true}
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        onMenuItemClick={() => {}}
        onSearchClick={() => {}}
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
    );
  }

  // Desktop navigation component
  return (
    <DesktopNav
      navItems={navItems}
    />
  );
};

export default NavigationBanner;
