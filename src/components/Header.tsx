
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, User, X } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import CartDropdown from './CartDropdown';

interface HeaderProps {
  currentLanguage: 'en' | 'th';
  toggleLanguage: () => void;
}

const Header = ({ currentLanguage, toggleLanguage }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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
      searchPlaceholder: "Search products or recipes..."
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
      searchPlaceholder: "ค้นหาสินค้าหรือสูตรอาหาร..."
    }
  };

  const t = translations[currentLanguage];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="mr-8">
              <h1 className="text-2xl font-bold text-thai-purple">
                Anong Thai
              </h1>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-thai-purple transition">{t.home}</Link>
              <Link to="/shop" className="text-gray-700 hover:text-thai-purple transition">{t.shop}</Link>
              <Link to="/recipes" className="text-gray-700 hover:text-thai-purple transition">{t.recipes}</Link>
              <Link to="/about" className="text-gray-700 hover:text-thai-purple transition">{t.about}</Link>
              <Link to="/contact" className="text-gray-700 hover:text-thai-purple transition">{t.contact}</Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={toggleLanguage}
              className="font-bold"
            >
              {currentLanguage === 'en' ? 'TH' : 'EN'}
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
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => console.log('Account functionality to be implemented')}
                aria-label={t.account}
              >
                <User className="h-5 w-5" />
              </Button>
              
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
          <div className="absolute left-0 right-0 bg-white shadow-md p-4 animate-fade-in">
            <div className="container mx-auto flex items-center">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thai-purple focus:border-transparent"
              />
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
              className="text-gray-700 hover:text-thai-purple p-2 transition" 
              onClick={() => setIsMenuOpen(false)}
            >
              {t.home}
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-700 hover:text-thai-purple p-2 transition" 
              onClick={() => setIsMenuOpen(false)}
            >
              {t.shop}
            </Link>
            <Link 
              to="/recipes" 
              className="text-gray-700 hover:text-thai-purple p-2 transition" 
              onClick={() => setIsMenuOpen(false)}
            >
              {t.recipes}
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-thai-purple p-2 transition" 
              onClick={() => setIsMenuOpen(false)}
            >
              {t.about}
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-thai-purple p-2 transition" 
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
              <Button variant="ghost" size="sm" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {t.account}
              </Button>
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
  );
};

export default Header;
