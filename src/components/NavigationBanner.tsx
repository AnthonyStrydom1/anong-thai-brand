
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useLanguage } from '@/contexts/LanguageContext';

const NavigationBanner = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const currentPath = location.pathname;
  
  const translations = {
    en: {
      home: "Home",
      shop: "Shop",
      recipes: "Recipes",
      about: "About",
      contact: "Contact",
    },
    th: {
      home: "หน้าหลัก",
      shop: "ซื้อสินค้า",
      recipes: "สูตรอาหาร",
      about: "เกี่ยวกับอนงค์",
      contact: "ติดต่อเรา",
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
    <div className="bg-[#520F7A] sticky top-0 z-40 relative thai-motif-bg">
      {/* Add a thin decorative gold line along the top */}
      <div className="h-1 bg-gradient-to-r from-thai-gold/20 via-thai-gold to-thai-gold/20"></div>
      
      <div className="container mx-auto relative z-10">
        <nav className="flex justify-center">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "px-4 py-3 text-white transition-all duration-200 relative",
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
      
      {/* Add a thin decorative gold line along the bottom */}
      <div className="h-0.5 bg-gradient-to-r from-thai-gold/20 via-thai-gold to-thai-gold/20"></div>
    </div>
  );
};

export default NavigationBanner;
