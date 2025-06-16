
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopNav from './navigation/DesktopNav';
import MobileMenu from './navigation/MobileMenu';

const NavigationBanner = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { currency } = useCurrency();
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

  // Mobile navigation component
  if (isMobile) {
    return (
      <MobileMenu
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        translations={{
          login: language === 'th' ? 'เข้าสู่ระบบ' : 'Login',
          profile: language === 'th' ? 'โปรไฟล์' : 'Profile',
          logout: language === 'th' ? 'ออกจากระบบ' : 'Logout',
          account: language === 'th' ? 'บัญชี' : 'Account',
          orders: language === 'th' ? 'คำสั่งซื้อ' : 'Orders',
          settings: language === 'th' ? 'ตั้งค่า' : 'Settings'
        }}
      />
    );
  }

  // Desktop navigation component
  return (
    <DesktopNav
      isLoggedIn={isLoggedIn}
      onLogout={handleLogout}
      translations={{
        login: language === 'th' ? 'เข้าสู่ระบบ' : 'Login',
        profile: language === 'th' ? 'โปรไฟล์' : 'Profile',
        logout: language === 'th' ? 'ออกจากระบบ' : 'Logout',
        account: language === 'th' ? 'บัญชี' : 'Account',
        orders: language === 'th' ? 'คำสั่งซื้อ' : 'Orders',
        settings: language === 'th' ? 'ตั้งค่า' : 'Settings'
      }}
    />
  );
};

export default NavigationBanner;
