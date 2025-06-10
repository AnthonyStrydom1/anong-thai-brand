
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';
import { User, ShoppingBag, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Account = () => {
  const { language } = useLanguage();
  const { user, userProfile, isLoading } = useAuth();
  
  const translations = {
    en: {
      title: 'My Account',
      dashboard: 'Account Dashboard',
      welcomeBack: 'Welcome back to your account',
      quickActions: 'Quick Actions',
      viewProfile: 'View Profile',
      viewOrders: 'My Orders',
      accountSettings: 'Account Settings',
      loginRequired: 'Please log in to access your account',
      recentActivity: 'Recent Activity',
      noRecentActivity: 'No recent activity'
    },
    th: {
      title: 'บัญชีของฉัน',
      dashboard: 'แดชบอร์ดบัญชี',
      welcomeBack: 'ยินดีต้อนรับกลับสู่บัญชีของคุณ',
      quickActions: 'การดำเนินการด่วน',
      viewProfile: 'ดูโปรไฟล์',
      viewOrders: 'คำสั่งซื้อของฉัน',
      accountSettings: 'การตั้งค่าบัญชี',
      loginRequired: 'กรุณาเข้าสู่ระบบเพื่อเข้าถึงบัญชีของคุณ',
      recentActivity: 'กิจกรรมล่าสุด',
      noRecentActivity: 'ไม่มีกิจกรรมล่าสุด'
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#c2b59b]">
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-thai-purple mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#c2b59b]">
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <User className="h-16 w-16 text-thai-purple mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4 text-thai-purple">{t.title}</h1>
              <p className="text-gray-600 mb-6">{t.loginRequired}</p>
              <p className="text-sm text-gray-500">
                Use the user menu (👤) in the navigation bar to sign in or create an account.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#c2b59b]">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-thai-purple">{t.dashboard}</h2>
            <p className="text-gray-600 mb-6">
              {t.welcomeBack}, {userProfile?.firstName || user.email}!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/profile"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-6 w-6 text-thai-purple mr-3" />
                <span>{t.viewProfile}</span>
              </Link>
              
              <Link 
                to="/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag className="h-6 w-6 text-thai-purple mr-3" />
                <span>{t.viewOrders}</span>
              </Link>
              
              <Link 
                to="/settings"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-6 w-6 text-thai-purple mr-3" />
                <span>{t.accountSettings}</span>
              </Link>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-thai-purple">{t.recentActivity}</h3>
            <p className="text-gray-500">{t.noRecentActivity}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
