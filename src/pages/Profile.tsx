import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import NavigationBanner from '@/components/NavigationBanner';
import Footer from '@/components/Footer';
import EditProfileForm from '@/components/EditProfileForm';
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';

const Profile = () => {
  const { language } = useLanguage();
  const { user, userProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
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
      loginRequired: 'Please log in to view your profile',
      editProfile: 'Edit Profile',
      viewMode: 'View Profile'
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
      loginRequired: 'กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์ของคุณ',
      editProfile: 'แก้ไขโปรไฟล์',
      viewMode: 'ดูโปรไฟล์'
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-cream">
        <NavigationBanner />
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
        <NavigationBanner />
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

  const handleEditSave = () => {
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <NavigationBanner />
      <main className="flex-1 container mx-auto px-4 py-12 watercolor-bg">
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-premium text-3xl text-anong-dark-green">{t.title}</h1>
          
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
            className="border-anong-sage/20 text-anong-charcoal hover:bg-anong-sage/10 font-serif"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? t.viewMode : t.editProfile}
          </Button>
        </div>
        
        <div className="luxury-card p-8 mb-8">
          {isEditing ? (
            <>
              <h2 className="heading-elegant text-xl mb-6 text-anong-dark-green">Edit Profile</h2>
              <EditProfileForm 
                onSave={handleEditSave}
                onCancel={handleEditCancel}
              />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
