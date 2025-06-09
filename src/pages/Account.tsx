
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ShoppingBag, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccountProps {
  isLoggedIn: boolean;
  onLogin: (email?: string, password?: string) => void;
  onLogout: () => void;
}

const Account = ({ isLoggedIn, onLogin, onLogout }: AccountProps) => {
  const { language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
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
      dashboard: 'Account Dashboard',
      welcomeBack: 'Welcome back to your account',
      quickActions: 'Quick Actions',
      viewProfile: 'View Profile',
      viewOrders: 'My Orders',
      accountSettings: 'Account Settings',
      logout: 'Logout',
      login: 'Login',
      loginSuccess: 'Successfully logged in',
      logoutSuccess: 'Successfully logged out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      createAccount: 'Create Account',
      signUp: 'Sign Up',
      alreadyHaveAccount: 'Already have an account? Sign In',
      dontHaveAccount: "Don't have an account? Create one",
      welcomeMessage: 'Welcome to Anong Thai',
      joinUs: 'Join Anong Thai',
      registrationSuccess: 'Account created successfully! Please log in.',
      signInToAccount: 'Sign in to your Anong Thai account',
      joinAnongThai: 'Join Anong Thai today',
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
      logout: 'ออกจากระบบ',
      login: 'เข้าสู่ระบบ',
      loginSuccess: 'เข้าสู่ระบบสำเร็จ',
      logoutSuccess: 'ออกจากระบบสำเร็จ',
      email: 'อีเมล',
      password: 'รหัสผ่าน',
      confirmPassword: 'ยืนยันรหัสผ่าน',
      fullName: 'ชื่อเต็ม',
      createAccount: 'สร้างบัญชี',
      signUp: 'สมัครสมาชิก',
      alreadyHaveAccount: 'มีบัญชีแล้ว? เข้าสู่ระบบ',
      dontHaveAccount: 'ไม่มีบัญชี? สร้างบัญชีใหม่',
      welcomeMessage: 'ยินดีต้อนรับสู่อนงค์ไทย',
      joinUs: 'เข้าร่วมกับอนงค์ไทย',
      registrationSuccess: 'สร้างบัญชีสำเร็จ! กรุณาเข้าสู่ระบบ',
      signInToAccount: 'เข้าสู่ระบบบัญชีอนงค์ไทยของคุณ',
      joinAnongThai: 'เข้าร่วมกับอนงค์ไทยวันนี้',
      recentActivity: 'กิจกรรมล่าสุด',
      noRecentActivity: 'ไม่มีกิจกรรมล่าสุด'
    }
  };

  const t = translations[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
        onLogin(formData.email, formData.password);
        toast({
          title: t.loginSuccess,
        });
      } else {
        toast({
          title: t.registrationSuccess,
        });
        setIsLogin(true);
        setFormData({
          email: formData.email,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#c2b59b]">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-thai-purple">{t.title}</h1>
        
        {isLoggedIn ? (
          // Dashboard view for logged-in users
          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-thai-purple">{t.dashboard}</h2>
              <p className="text-gray-600 mb-6">{t.welcomeBack}</p>
              
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

            <div className="bg-white shadow-md rounded-lg p-6">
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {t.logout}
              </Button>
            </div>
          </div>
        ) : (
          // Login/Registration form for non-logged-in users
          <div className="max-w-md mx-auto">
            <div className="bg-white shadow-md rounded-lg p-8">
              <div className="text-center space-y-2 mb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-thai-purple to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isLogin ? t.welcomeMessage : t.joinUs}
                </h2>
                <p className="text-gray-600">
                  {isLogin ? t.signInToAccount : t.joinAnongThai}
                </p>
              </div>

              <div className="space-y-4">
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

                <Button 
                  type="button"
                  onClick={handleLogin}
                  className="bg-thai-purple hover:bg-thai-purple/90 w-full"
                >
                  {isLogin ? t.login : t.createAccount}
                </Button>
              </div>

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
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;
