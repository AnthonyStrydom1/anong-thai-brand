
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';

const Profile = () => {
  const { language } = useLanguage();
  const { user, userProfile, isLoading } = useAuth();
  
  const translations = {
    en: {
      title: 'My Profile',
      welcome: 'Welcome to your profile',
      profileInfo: 'Here you can view and manage your personal information.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      placeholder: 'Not provided',
      loginRequired: 'Please log in to view your profile'
    },
    th: {
      title: 'โปรไฟล์ของฉัน',
      welcome: 'ยินดีต้อนรับสู่โปรไฟล์ของคุณ',
      profileInfo: 'ที่นี่คุณสามารถดูและจัดการข้อมูลส่วนตัวของคุณ',
      name: 'ชื่อ',
      email: 'อีเมล',
      phone: 'โทรศัพท์',
      address: 'ที่อยู่',
      placeholder: 'ไม่ได้ให้ข้อมูล',
      loginRequired: 'กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์ของคุณ'
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-cream">
        <main className="flex-1 container mx-auto px-4 py-12 watercolor-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-anong-dark-green"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-cream">
        <main className="flex-1 container mx-auto px-4 py-12 watercolor-bg">
          <div className="luxury-card p-8 text-center">
            <h1 className="heading-premium text-3xl mb-8 text-anong-dark-green">{t.title}</h1>
            <p className="text-luxury text-anong-charcoal/80">{t.loginRequired}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Use real user profile data
  const profileData = {
    name: userProfile ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || user.email?.split('@')[0] : user.email?.split('@')[0] || 'User',
    email: user.email || '',
    phone: userProfile?.phone || '',
    address: '' // Address would come from a separate address table if implemented
  };

  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <main className="flex-1 container mx-auto px-4 py-12 watercolor-bg">
        <h1 className="heading-premium text-3xl mb-8 text-anong-dark-green">{t.title}</h1>
        
        <div className="luxury-card p-8 mb-8">
          <h2 className="heading-elegant text-xl mb-6 text-anong-dark-green">{t.welcome}</h2>
          <p className="text-luxury mb-8 text-anong-charcoal/80">{t.profileInfo}</p>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-anong-charcoal mb-2 font-serif">{t.name}</label>
                <p className="p-4 border border-anong-sage/20 rounded-lg bg-anong-warm-cream/50 font-serif">
                  {profileData.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-anong-charcoal mb-2 font-serif">{t.email}</label>
                <p className="p-4 border border-anong-sage/20 rounded-lg bg-anong-warm-cream/50 font-serif">
                  {profileData.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-anong-charcoal mb-2 font-serif">{t.phone}</label>
                <p className="p-4 border border-anong-sage/20 rounded-lg bg-anong-warm-cream/50 font-serif">
                  {profileData.phone || t.placeholder}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-anong-charcoal mb-2 font-serif">{t.address}</label>
                <p className="p-4 border border-anong-sage/20 rounded-lg bg-anong-warm-cream/50 font-serif">
                  {profileData.address || t.placeholder}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
