
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, User, X, LogIn, LogOut } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import CartDropdown from './CartDropdown';
import NavigationBanner from './NavigationBanner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  
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
      about: "About Anong",
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

  return (
    <>
      <NavigationBanner />
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="mr-8">
                <h1 className="text-2xl font-bold text-[#520F7A]">
                  Anong Thai
                </h1>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className="text-gray-700 hover:text-[#520F7A] transition">{t.home}</Link>
                <Link to="/shop" className="text-gray-700 hover:text-[#520F7A] transition">{t.shop}</Link>
                <Link to="/recipes" className="text-gray-700 hover:text-[#520F7A] transition">{t.recipes}</Link>
                <Link to="/about" className="text-gray-700 hover:text-[#520F7A] transition">{t.about}</Link>
                <Link to="/contact" className="text-gray-700 hover:text-[#520F7A] transition">{t.contact}</Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={toggleLanguage}
                className="font-bold"
              >
                {language === 'en' ? 'TH' : 'EN'}
              </Button>
              
              <div className="hidden md:flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleSearch}
                  aria-label={t.search}
                >
                  <Search className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      aria-label={t.account}
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
                className="md:hidden" 
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
          <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t.home}
              </Link>
              <Link 
                to="/shop" 
                className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t.shop}
              </Link>
              <Link 
                to="/recipes" 
                className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t.recipes}
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t.about}
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
                onClick={() => setIsMenuOpen(false)}
              >
                {t.contact}
              </Link>
              <hr className="border-gray-200" />
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center"
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
                    className="flex items-center text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.logout}
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center"
                    onClick={handleLogin}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t.login}
                  </Button>
                )}
                <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {t.cart}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
