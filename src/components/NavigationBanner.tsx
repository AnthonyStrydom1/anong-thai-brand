
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
    <div className="bg-[#520F7A] sticky top-0 z-40 relative">
      {/* Thai motifs decoration - top */}
      <div className="absolute top-0 left-0 w-full h-2 bg-repeat-x" 
           style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"8\" viewBox=\"0 0 24 8\"><path d=\"M0,0 L8,4 L0,8 L0,0 Z M8,0 L16,4 L8,8 L8,0 Z M16,0 L24,4 L16,8 L16,0 Z\" fill=\"%23D4AF37\"/></svg>')" }}>
      </div>

      <div className="container mx-auto">
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
      
      {/* Thai motifs decoration - bottom */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-repeat-x" 
           style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"8\" viewBox=\"0 0 24 8\"><path d=\"M0,0 L8,4 L0,8 L0,0 Z M8,0 L16,4 L8,8 L8,0 Z M16,0 L24,4 L16,8 L16,0 Z\" fill=\"%23D4AF37\"/></svg>')" }}>
      </div>
    </div>
  );
};

export default NavigationBanner;
