
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const HeaderNav = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      home: "Home",
      shop: "Shop",
      recipes: "Recipes",
      about: "About Anong",
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

  return (
    <nav className="hidden md:flex space-x-6">
      <Link to="/" className="text-gray-700 hover:text-[#520F7A] transition">{t.home}</Link>
      <Link to="/shop" className="text-gray-700 hover:text-[#520F7A] transition">{t.shop}</Link>
      <Link to="/recipes" className="text-gray-700 hover:text-[#520F7A] transition">{t.recipes}</Link>
      <Link to="/about" className="text-gray-700 hover:text-[#520F7A] transition">{t.about}</Link>
      <Link to="/contact" className="text-gray-700 hover:text-[#520F7A] transition">{t.contact}</Link>
    </nav>
  );
};

export default HeaderNav;
