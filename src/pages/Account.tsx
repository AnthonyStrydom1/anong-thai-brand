
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Account = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: 'My Account',
      accountInfo: 'Account Information',
      preferences: 'Preferences',
      security: 'Security Settings',
      language: 'Language',
      notifications: 'Notifications',
      changePassword: 'Change Password',
      twoFactor: 'Two-Factor Authentication',
      save: 'Save Changes'
    },
    th: {
      title: 'บัญชีของฉัน',
      accountInfo: 'ข้อมูลบัญชี',
      preferences: 'การตั้งค่า',
      security: 'การตั้งค่าความปลอดภัย',
      language: 'ภาษา',
      notifications: 'การแจ้งเตือน',
      changePassword: 'เปลี่ยนรหัสผ่าน',
      twoFactor: 'การยืนยันตัวตนแบบสองขั้นตอน',
      save: 'บันทึกการเปลี่ยนแปลง'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t.accountInfo}</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple"
                    defaultValue="john.doe@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple"
                    defaultValue="John Doe"
                  />
                </div>
                
                <Button type="submit" className="bg-thai-purple hover:bg-thai-purple/90">
                  {t.save}
                </Button>
              </form>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t.security}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{t.changePassword}</span>
                  <Button variant="outline">Change</Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t.twoFactor}</span>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preferences */}
          <div className="bg-white shadow-md rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">{t.preferences}</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{t.language}</span>
                <select className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple">
                  <option value="en">English</option>
                  <option value="th">ไทย</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span>{t.notifications}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
