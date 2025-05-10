
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Search, ShoppingCart } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  onSearchOpen, 
  isLoggedIn,
  onLogin,
  onLogout
}: MobileMenuProps) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      home: "Home",
      shop: "Shop",
      recipes: "Recipes",
      about: "About Anong",
      contact: "Contact",
      search: "Search",
      cart: "Cart",
      login: "Login",
      logout: "Logout",
    },
    th: {
      home: "หน้าหลัก",
      shop: "ซื้อสินค้า",
      recipes: "สูตรอาหาร",
      about: "เกี่ยวกับอนงค์",
      contact: "ติดต่อเรา",
      search: "ค้นหา",
      cart: "ตะกร้า",
      login: "เข้าสู่ระบบ",
      logout: "ออกจากระบบ",
    }
  };

  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
      <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
        <Link 
          to="/" 
          className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
          onClick={onClose}
        >
          {t.home}
        </Link>
        <Link 
          to="/shop" 
          className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
          onClick={onClose}
        >
          {t.shop}
        </Link>
        <Link 
          to="/recipes" 
          className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
          onClick={onClose}
        >
          {t.recipes}
        </Link>
        <Link 
          to="/about" 
          className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
          onClick={onClose}
        >
          {t.about}
        </Link>
        <Link 
          to="/contact" 
          className="text-gray-700 hover:text-[#520F7A] p-2 transition" 
          onClick={onClose}
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
              onClose();
              onSearchOpen();
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
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.logout}
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center"
              onClick={onLogin}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {t.login}
            </Button>
          )}
          <Link to="/cart" onClick={onClose}>
            <Button variant="ghost" size="sm" className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t.cart}
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
