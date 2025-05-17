
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const Account = () => {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const translations = {
    en: {
      title: 'My Account',
      accountInfo: 'Account Information',
      preferences: 'Preferences',
      security: 'Security Settings',
      language: 'Language',
      notifications: 'Notifications',
      changePassword: 'Change Password',
      resetPassword: 'Reset Password',
      twoFactor: 'Two-Factor Authentication',
      save: 'Save Changes',
      login: 'Login',
      logout: 'Logout',
      loginSuccess: 'Successfully logged in',
      logoutSuccess: 'Successfully logged out',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      email: 'Email',
      password: 'Password',
      sendResetLink: 'Send Reset Link',
      resetInstructions: 'Enter your email to receive password reset instructions',
      cancel: 'Cancel',
      loginInstructions: 'Please enter your credentials to login',
      loginToAccount: 'Login to Your Account',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot Password?'
    },
    th: {
      title: 'บัญชีของฉัน',
      accountInfo: 'ข้อมูลบัญชี',
      preferences: 'การตั้งค่า',
      security: 'การตั้งค่าความปลอดภัย',
      language: 'ภาษา',
      notifications: 'การแจ้งเตือน',
      changePassword: 'เปลี่ยนรหัสผ่าน',
      resetPassword: 'รีเซ็ตรหัสผ่าน',
      twoFactor: 'การยืนยันตัวตนแบบสองขั้นตอน',
      save: 'บันทึกการเปลี่ยนแปลง',
      login: 'เข้าสู่ระบบ',
      logout: 'ออกจากระบบ',
      loginSuccess: 'เข้าสู่ระบบสำเร็จ',
      logoutSuccess: 'ออกจากระบบสำเร็จ',
      currentPassword: 'รหัสผ่านปัจจุบัน',
      newPassword: 'รหัสผ่านใหม่',
      confirmPassword: 'ยืนยันรหัสผ่าน',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      sendResetLink: 'ส่งลิงค์รีเซ็ต',
      resetInstructions: 'ป้อนอีเมลของคุณเพื่อรับคำแนะนำในการรีเซ็ตรหัสผ่าน',
      cancel: 'ยกเลิก',
      loginInstructions: 'โปรดป้อนข้อมูลประจำตัวของคุณเพื่อเข้าสู่ระบบ',
      loginToAccount: 'เข้าสู่ระบบบัญชีของคุณ',
      rememberMe: 'จดจำฉัน',
      forgotPassword: 'ลืมรหัสผ่าน?'
    }
  };

  const t = translations[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      toast({
        title: t.loginSuccess,
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: t.logoutSuccess,
    });
  };

  const handleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
    setIsResettingPassword(false);
  };

  const handleResetPassword = () => {
    setIsResettingPassword(!isResettingPassword);
    setIsChangingPassword(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password changed successfully",
    });
    setIsChangingPassword(false);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password reset link sent",
      description: "Check your email for instructions to reset your password",
    });
    setIsResettingPassword(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#c2b59b]">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Information */}
          <div className="md:col-span-2 space-y-6">
            {isLoggedIn ? (
              <>
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
                  
                  {isChangingPassword ? (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">{t.currentPassword}</label>
                        <input 
                          type="password" 
                          id="currentPassword"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">{t.newPassword}</label>
                        <input 
                          type="password" 
                          id="newPassword"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">{t.confirmPassword}</label>
                        <input 
                          type="password" 
                          id="confirmPassword"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-thai-purple hover:bg-thai-purple/90">
                          {t.save}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleChangePassword}>
                          {t.cancel}
                        </Button>
                      </div>
                    </form>
                  ) : isResettingPassword ? (
                    <form onSubmit={handleResetSubmit} className="space-y-4">
                      <p className="text-sm text-gray-600 mb-4">{t.resetInstructions}</p>
                      <div>
                        <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">{t.email}</label>
                        <input 
                          type="email" 
                          id="resetEmail"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-thai-purple focus:border-thai-purple"
                          defaultValue="john.doe@example.com"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="bg-thai-purple hover:bg-thai-purple/90">
                          {t.sendResetLink}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleResetPassword}>
                          {t.cancel}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{t.changePassword}</span>
                        <Button variant="outline" onClick={handleChangePassword}>Change</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t.resetPassword}</span>
                        <Button variant="outline" onClick={handleResetPassword}>Reset</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t.twoFactor}</span>
                        <Button variant="outline">Enable</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t.logout}</span>
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{t.loginToAccount}</h2>
                <p className="mb-4 text-gray-600">{t.loginInstructions}</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700">{t.email}</label>
                    <Input 
                      type="email" 
                      id="loginEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">{t.password}</label>
                    <Input 
                      type="password" 
                      id="loginPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        className="h-4 w-4 text-thai-purple focus:ring-thai-purple border-gray-300 rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                        {t.rememberMe}
                      </label>
                    </div>
                    <Button 
                      variant="link" 
                      type="button" 
                      className="text-thai-purple p-0 h-auto"
                      onClick={handleResetPassword}
                    >
                      {t.forgotPassword}
                    </Button>
                  </div>
                  
                  <Button type="submit" className="bg-thai-purple hover:bg-thai-purple/90 w-full">
                    {t.login}
                  </Button>
                </form>
              </div>
            )}
          </div>
          
          {/* Preferences */}
          {isLoggedIn && (
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
