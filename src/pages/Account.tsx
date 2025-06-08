import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

interface AccountProps {
  isLoggedIn: boolean;
  onLogin: (email?: string, password?: string) => void;
  onLogout: () => void;
}

const Account = ({ isLoggedIn, onLogin, onLogout }: AccountProps) => {
  const { language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
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
      forgotPassword: 'Forgot Password?',
      createAccount: 'Create Account',
      signUp: 'Sign Up',
      fullName: 'Full Name',
      alreadyHaveAccount: 'Already have an account? Sign In',
      dontHaveAccount: "Don't have an account? Create one",
      welcomeBack: 'Welcome Back',
      joinUs: 'Join Anong Thai',
      registrationSuccess: 'Account created successfully! Please log in.',
      signInToAccount: 'Sign in to your Anong Thai account',
      joinAnongThai: 'Join Anong Thai today'
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
      forgotPassword: 'ลืมรหัสผ่าน?',
      createAccount: 'สร้างบัญชี',
      signUp: 'สมัครสมาชิก',
      fullName: 'ชื่อเต็ม',
      alreadyHaveAccount: 'มีบัญชีแล้ว? เข้าสู่ระบบ',
      dontHaveAccount: 'ไม่มีบัญชี? สร้างบัญชีใหม่',
      welcomeBack: 'ขอต้อนรับกลับ',
      joinUs: 'เข้าร่วมกับอนงค์ไทย',
      registrationSuccess: 'สร้างบัญชีสำเร็จ! กรุณาเข้าสู่ระบบ',
      signInToAccount: 'เข้าสู่ระบบบัญชีอนงค์ไทยของคุณ',
      joinAnongThai: 'เข้าร่วมกับอนงค์ไทยวันนี้'
    }
  };

  const t = translations[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      if (isLogin) {
        // Handle login logic using the passed onLogin function
        onLogin(formData.email, formData.password);
        toast({
          title: t.loginSuccess,
        });
      } else {
        // Handle registration logic
        toast({
          title: t.registrationSuccess,
        });
        // Switch to login mode after successful registration
        setIsLogin(true);
        setFormData({
          email: formData.email, // Keep email for login
          password: '',
          confirmPassword: '',
          fullName: ''
        });
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    toast({
      title: t.logoutSuccess,
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: ''
    });
    setErrors({});
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
              // ... keep existing code (logged in state JSX)
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
              // ... keep existing code (login/registration form JSX)
              <div className="bg-white shadow-md rounded-lg p-8">
                {/* Header */}
                <div className="text-center space-y-2 mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-thai-purple to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isLogin ? t.welcomeBack : t.joinUs}
                  </h2>
                  <p className="text-gray-600">
                    {isLogin ? t.signInToAccount : t.joinAnongThai}
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Full Name (Registration only) */}
                  {!isLogin && (
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {t.fullName}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.email}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {t.password}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-10 pr-12 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password (Registration only) */}
                  {!isLogin && (
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {t.confirmPassword}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`pl-10 pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {/* Remember Me & Forgot Password (Login only) */}
                  {isLogin && (
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
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="button"
                    onClick={handleLogin}
                    className="bg-thai-purple hover:bg-thai-purple/90 w-full"
                  >
                    {isLogin ? t.login : t.createAccount}
                  </Button>
                </div>

                {/* Toggle Mode */}
                <div className="text-center space-y-4 mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={toggleMode}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-5 h-5 text-gray-500" />
                    <span>
                      {isLogin ? t.dontHaveAccount : t.alreadyHaveAccount}
                    </span>
                  </Button>
                </div>
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
