import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import NavigationBanner from '@/components/NavigationBanner';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const translations = {
    en: {
      title: 'Settings',
      account: 'Account Settings',
      notifications: 'Notification Settings',
      privacy: 'Privacy Settings',
      language: 'Language',
      emailNotifications: 'Email Notifications',
      promotions: 'Promotional emails',
      updates: 'Product updates',
      orders: 'Order status updates',
      dataSharing: 'Data Sharing',
      analytics: 'Allow analytics',
      thirdParty: 'Share with third parties',
      save: 'Save Changes',
      cancel: 'Cancel'
    },
    th: {
      title: 'ตั้งค่า',
      account: 'ตั้งค่าบัญชี',
      notifications: 'ตั้งค่าการแจ้งเตือน',
      privacy: 'ตั้งค่าความเป็นส่วนตัว',
      language: 'ภาษา',
      emailNotifications: 'การแจ้งเตือนทางอีเมล',
      promotions: 'อีเมลโปรโมชั่น',
      updates: 'อัปเดตผลิตภัณฑ์',
      orders: 'อัปเดตสถานะคำสั่งซื้อ',
      dataSharing: 'การแบ่งปันข้อมูล',
      analytics: 'อนุญาตการวิเคราะห์',
      thirdParty: 'แบ่งปันกับบุคคลที่สาม',
      save: 'บันทึกการเปลี่ยนแปลง',
      cancel: 'ยกเลิก'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBanner />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
          {/* Language Settings */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t.account}</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">{t.language}</span>
              <select className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple">
                <option value="en">English</option>
                <option value="th">ไทย</option>
              </select>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t.notifications}</h2>
            <div className="space-y-4">
              <p className="text-gray-600 mb-2">{t.emailNotifications}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.promotions}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.updates}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.orders}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t.privacy}</h2>
            <div className="space-y-4">
              <p className="text-gray-600 mb-2">{t.dataSharing}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.analytics}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.thirdParty}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="p-6 flex justify-end space-x-3">
            <Button variant="outline">{t.cancel}</Button>
            <Button className="bg-thai-purple hover:bg-thai-purple/90">{t.save}</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
