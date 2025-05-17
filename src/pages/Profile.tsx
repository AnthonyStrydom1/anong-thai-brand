
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Profile = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: 'My Profile',
      welcome: 'Welcome to your profile',
      profileInfo: 'Here you can view and manage your personal information.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      placeholder: 'Not provided'
    },
    th: {
      title: 'โปรไฟล์ของฉัน',
      welcome: 'ยินดีต้อนรับสู่โปรไฟล์ของคุณ',
      profileInfo: 'ที่นี่คุณสามารถดูและจัดการข้อมูลส่วนตัวของคุณ',
      name: 'ชื่อ',
      email: 'อีเมล',
      phone: 'โทรศัพท์',
      address: 'ที่อยู่',
      placeholder: 'ไม่ได้ให้ข้อมูล'
    }
  };

  const t = translations[language];

  // Mock profile data (would come from a real auth system)
  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '',
    address: ''
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t.welcome}</h2>
          <p className="text-gray-600 mb-6">{t.profileInfo}</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.name}</label>
                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                  {profileData.name}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.email}</label>
                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                  {profileData.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.phone}</label>
                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                  {profileData.phone || t.placeholder}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.address}</label>
                <p className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
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
