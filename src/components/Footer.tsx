
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MapPin, Clock, Phone } from "lucide-react";

const Footer = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      quickLinks: "Quick Links",
      home: "Home",
      shop: "Shop",
      recipes: "Recipes", 
      about: "About",
      contact: "Contact",
      followUs: "Follow Us",
      visitRestaurant: "Visit ANONG Restaurant",
      address: "123 Main Street, Cape Town, 8001",
      hours: "Monday - Sunday: 11:00 AM - 10:00 PM",
      phone: "+27 21 123 4567",
      copyright: "© 2024 ANONG. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service"
    },
    th: {
      quickLinks: "ลิงก์ด่วน",
      home: "หน้าแรก",
      shop: "ร้านค้า",
      recipes: "สูตรอาหาร",
      about: "เกี่ยวกับเรา",
      contact: "ติดต่อ",
      followUs: "ติดตามเรา",
      visitRestaurant: "เยี่ยมชมร้านอาหาร ANONG",
      address: "123 ถนนหลัก เคปทาวน์ 8001",
      hours: "จันทร์ - อาทิตย์: 11:00 - 22:00 น.",
      phone: "+27 21 123 4567",
      copyright: "© 2024 ANONG สงวนลิขสิทธิ์ทั้งหมด",
      privacyPolicy: "นโยบายความเป็นส่วนตัว",
      termsOfService: "เงื่อนไขการให้บริการ"
    }
  };
  
  const t = translations[language];
  
  return (
    <footer className="bg-anong-dark-green text-anong-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-light tracking-wide">ANONG</h3>
            <p className="text-anong-cream/80 text-sm leading-relaxed">
              {language === 'en' 
                ? "Authentic Thai flavors crafted with passion and tradition."
                : "รสชาติไทยแท้ที่สร้างสรรค์ด้วยความหลงใหลและประเพณี"
              }
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-medium text-lg">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-anong-cream/80 hover:text-anong-gold transition-colors text-sm">{t.home}</Link></li>
              <li><Link to="/shop" className="text-anong-cream/80 hover:text-anong-gold transition-colors text-sm">{t.shop}</Link></li>
              <li><Link to="/recipes" className="text-anong-cream/80 hover:text-anong-gold transition-colors text-sm">{t.recipes}</Link></li>
              <li><Link to="/about" className="text-anong-cream/80 hover:text-anong-gold transition-colors text-sm">{t.about}</Link></li>
              <li><Link to="/contact" className="text-anong-cream/80 hover:text-anong-gold transition-colors text-sm">{t.contact}</Link></li>
            </ul>
          </div>
          
          {/* Restaurant Information */}
          <div className="space-y-4">
            <h4 className="font-serif font-medium text-lg">{t.visitRestaurant}</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-anong-gold mt-1 flex-shrink-0" />
                <span className="text-anong-cream/80 text-sm">{t.address}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-anong-gold mt-1 flex-shrink-0" />
                <span className="text-anong-cream/80 text-sm">{t.hours}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-anong-gold mt-1 flex-shrink-0" />
                <span className="text-anong-cream/80 text-sm">{t.phone}</span>
              </div>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-serif font-medium text-lg">{t.followUs}</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-anong-cream/80 hover:text-anong-gold transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-anong-cream/80 hover:text-anong-gold transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.349-1.051-2.349-2.348s1.052-2.349 2.349-2.349c1.296 0 2.348 1.052 2.348 2.349s-1.052 2.348-2.348 2.348zm7.718 0c-1.297 0-2.349-1.051-2.349-2.348s1.052-2.349 2.349-2.349c1.296 0 2.348 1.052 2.348 2.349s-1.052 2.348-2.348 2.348z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-anong-cream/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-anong-cream/60 text-sm">{t.copyright}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-anong-cream/60 hover:text-anong-gold transition-colors text-sm">{t.privacyPolicy}</a>
            <a href="#" className="text-anong-cream/60 hover:text-anong-gold transition-colors text-sm">{t.termsOfService}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
