import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import NavigationBanner from '@/components/NavigationBanner';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const { language, toggleLanguage } = useLanguage();
  
  // State for notification settings
  const [promotions, setPromotions] = useState(true);
  const [updates, setUpdates] = useState(true);
  const [orders, setOrders] = useState(true);
  
  // State for privacy settings
  const [analytics, setAnalytics] = useState(true);
  const [thirdParty, setThirdParty] = useState(false);
  
  // Keep track of original values for cancel functionality
  const [originalSettings, setOriginalSettings] = useState({
    promotions: true,
    updates: true,
    orders: true,
    analytics: true,
    thirdParty: false,
    language: 'en'
  });
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Store original settings when component loads
    setOriginalSettings({
      promotions,
      updates,
      orders,
      analytics,
      thirdParty,
      language
    });
  }, []);
  
  const handleSave = () => {
    console.log('💾 Settings: Saving settings...', {
      promotions,
      updates,
      orders,
      analytics,
      thirdParty,
      language
    });
    
    // Here you would typically save to a backend/database
    // For now, we'll just update the "original" settings and show success
    setOriginalSettings({
      promotions,
      updates,
      orders,
      analytics,
      thirdParty,
      language
    });
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  const handleCancel = () => {
    console.log('❌ Settings: Cancelling changes...');
    
    // Reset all settings to original values
    setPromotions(originalSettings.promotions);
    setUpdates(originalSettings.updates);
    setOrders(originalSettings.orders);
    setAnalytics(originalSettings.analytics);
    setThirdParty(originalSettings.thirdParty);
    
    // Reset language if it was changed
    if (originalSettings.language !== language) {
      toggleLanguage();
    }
    
    toast({
      title: "Changes cancelled",
      description: "All changes have been reverted.",
      variant: "destructive",
    });
  };
  
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
      cancel: 'Cancel',
      english: 'English',
      thai: 'Thai'
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
      cancel: 'ยกเลิก',
      english: 'อังกฤษ',
      thai: 'ไทย'
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
              <select 
                value={language} 
                onChange={(e) => {
                  if (e.target.value !== language) {
                    console.log('🌐 Settings: Language changed to:', e.target.value);
                    toggleLanguage();
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple"
              >
                <option value="en">{t.english}</option>
                <option value="th">{t.thai}</option>
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
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={promotions}
                    onChange={(e) => {
                      console.log('📧 Settings: Promotions toggle:', e.target.checked);
                      setPromotions(e.target.checked);
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.updates}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={updates}
                    onChange={(e) => {
                      console.log('📦 Settings: Updates toggle:', e.target.checked);
                      setUpdates(e.target.checked);
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.orders}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={orders}
                    onChange={(e) => {
                      console.log('📋 Settings: Orders toggle:', e.target.checked);
                      setOrders(e.target.checked);
                    }}
                  />
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
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={analytics}
                    onChange={(e) => {
                      console.log('📊 Settings: Analytics toggle:', e.target.checked);
                      setAnalytics(e.target.checked);
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t.thirdParty}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={thirdParty}
                    onChange={(e) => {
                      console.log('🔗 Settings: Third party toggle:', e.target.checked);
                      setThirdParty(e.target.checked);
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thai-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thai-purple"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="p-6 flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="hover:bg-gray-50"
            >
              {t.cancel}
            </Button>
            <Button 
              className="bg-thai-purple hover:bg-thai-purple/90"
              onClick={handleSave}
            >
              {t.save}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
