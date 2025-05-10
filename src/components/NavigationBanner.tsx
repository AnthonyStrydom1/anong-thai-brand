
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, User, X, LogIn, LogOut } from "lucide-react";
import CartDropdown from './CartDropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

const NavigationBanner = () => {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    toast({
      title: translations[language].loginSuccess,
      description: translations[language].welcomeBack,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: translations[language].logoutSuccess,
    });
  };
  
  const translations = {
    en: {
      home: "Home",
      shop: "Shop",
      recipes: "Recipes",
      about: "About",
      contact: "Contact",
      search: "Search",
      cart: "Cart",
      account: "Account",
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      settings: "Settings",
      searchPlaceholder: "Search products or recipes...",
      clearSearch: "Clear",
      loginSuccess: "Successfully logged in",
      logoutSuccess: "Successfully logged out",
      welcomeBack: "Welcome back to Anong Thai!"
    },
    th: {
      home: "หน้าหลัก",
      shop: "ซื้อสินค้า",
      recipes: "สูตรอาหาร",
      about: "เกี่ยวกับอนงค์",
      contact: "ติดต่อเรา",
      search: "ค้นหา",
      cart: "ตะกร้า",
      account: "บัญชี",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ",
      profile: "โปรไฟล์",
      settings: "ตั้งค่า",
      searchPlaceholder: "ค้นหาสินค้าหรือสูตรอาหาร...",
      clearSearch: "ล้าง",
      loginSuccess: "เข้าสู่ระบบสำเร็จ",
      logoutSuccess: "ออกจากระบบสำเร็จ",
      welcomeBack: "ยินดีต้อนรับกลับสู่อนงค์ไทย!"
    }
  };

  const t = translations[language];

  const navItems = [
    { path: '/', label: t.home },
    { path: '/shop', label: t.shop },
    { path: '/recipes', label: t.recipes },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact },
  ];

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="bg-[#520F7A] sticky top-0 z-40 thai-motif-bg">
      {/* Add a thin decorative gold line along the top */}
      <div className="h-1 bg-gradient-to-r from-thai-gold/20 via-thai-gold to-thai-gold/20"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            <Link to="/" className="mr-4 lg:mr-8">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Anong Thai
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "px-3 py-2 text-white transition-all duration-200 relative",
                    isActive(item.path) 
                      ? "font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-thai-gold" 
                      : "hover:bg-[#631E8B]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="font-bold text-white"
            >
              {language === 'en' ? 'TH' : 'EN'}
            </Button>
            
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSearch}
                aria-label={t.search}
                className="text-white hover:bg-[#631E8B]"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    aria-label={t.account}
                    className="text-white hover:bg-[#631E8B]"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="w-full flex items-center">
                          {t.profile}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="w-full flex items-center">
                          {t.settings}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t.logout}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={handleLogin} className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      {t.login}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <CartDropdown />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white hover:bg-[#631E8B]" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Search overlay */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 bg-white shadow-md p-4 animate-fade-in z-30">
            <div className="container mx-auto flex items-center">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#520F7A] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  onClick={handleClearSearch}
                  className="ml-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  {t.clearSearch}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch}
                className="ml-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#631E8B] border-t border-thai-gold/30 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="text-white hover:text-thai-gold p-2 transition" 
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-thai-gold/30" />
            <div className="flex justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center text-white hover:text-thai-gold"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSearchOpen(true);
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                {t.search}
              </Button>
              {isLoggedIn ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t.logout}
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center text-white hover:text-thai-gold"
                  onClick={handleLogin}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {t.login}
                </Button>
              )}
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="flex items-center text-white hover:text-thai-gold">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t.cart}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
      
      {/* Add a thin decorative gold line along the bottom */}
      <div className="h-0.5 bg-gradient-to-r from-thai-gold/20 via-thai-gold to-thai-gold/20"></div>
    </div>
  );
};

export default NavigationBanner;
