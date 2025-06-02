
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MapPin, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      newsletter: "Stay Connected",
      email: "Enter your email address",
      submit: "Subscribe",
      shop: "Our Products",
      curryPastes: "Premium Curry Pastes",
      stirFrySauces: "Artisan Stir-Fry Sauces",
      dippingSauces: "Traditional Dipping Sauces",
      recipes: "Recipe Collection",
      about: "Our Heritage",
      contact: "Connect With Us",
      visitUs: "Visit ANONG Restaurant",
      address: "20 Hettie Street, Cyrildene, Johannesburg",
      hours: "Daily: 11:00 AM - 10:00 PM",
      phone: "076 505 9941",
      shipping: "Shipping & Delivery",
      returns: "Returns & Exchanges",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "© 2025 ANONG Thai Brand. Crafted with tradition, delivered with love."
    },
    th: {
      newsletter: "ติดตามข่าวสาร",
      email: "กรอกที่อยู่อีเมลของคุณ",
      submit: "สมัครสมาชิก",
      shop: "ผลิตภัณฑ์ของเรา",
      curryPastes: "พริกแกงพรีเมียม",
      stirFrySauces: "ซอสผัดช่างฝีมือ",
      dippingSauces: "น้ำจิ้มดั้งเดิม",
      recipes: "คลังสูตรอาหาร",
      about: "มรดกของเรา",
      contact: "ติดต่อเรา",
      visitUs: "เยี่ยมชมร้านอาหารอนงค์",
      address: "20 เฮตตี้ สตรีท ไซริลดีน โจฮันเนสเบิร์ก",
      hours: "ทุกวัน: 11:00 - 22:00 น.",
      phone: "076 505 9941",
      shipping: "การจัดส่งและการขนส่ง",
      returns: "การคืนสินค้าและการแลกเปลี่ยน",
      privacy: "นโยบายความเป็นส่วนตัว",
      terms: "เงื่อนไขการใช้บริการ",
      rights: "© 2025 แบรนด์อาหารไทยอนงค์ สร้างด้วยประเพณี ส่งมอบด้วยความรัก"
    }
  };

  const t = translations[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'en' ? "Welcome to our culinary family!" : "ยินดีต้อนรับสู่ครอบครัวอาหารของเรา!",
      description: language === 'en' ? "You'll receive our latest recipes and product updates." : "คุณจะได้รับสูตรอาหารและข่าวสารผลิตภัณฑ์ล่าสุด",
    });
  };

  return (
    <footer className={cn("bg-anong-black text-anong-ivory", className)}>
      {/* Decorative top border */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Shop Section */}
          <div className="space-y-4">
            <h4 className="anong-subheading text-anong-gold text-lg font-medium">
              {t.shop}
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/shop?category=curry-pastes", text: t.curryPastes },
                { to: "/shop?category=stir-fry-sauces", text: t.stirFrySauces },
                { to: "/shop?category=dipping-sauces", text: t.dippingSauces }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="anong-body text-anong-ivory/80 hover:text-anong-gold transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* About Section */}
          <div className="space-y-4">
            <h4 className="anong-subheading text-anong-gold text-lg font-medium">
              ANONG
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/recipes", text: t.recipes },
                { to: "/about", text: t.about },
                { to: "/contact", text: t.contact }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="anong-body text-anong-ivory/80 hover:text-anong-gold transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Visit Restaurant Section */}
          <div className="space-y-4">
            <h4 className="anong-subheading text-anong-gold text-lg font-medium">
              {t.visitUs}
            </h4>
            <div className="space-y-3 text-anong-ivory/80">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-anong-gold mt-1 flex-shrink-0" />
                <span className="anong-body text-sm">{t.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-anong-gold flex-shrink-0" />
                <span className="anong-body text-sm">{t.hours}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-anong-gold flex-shrink-0" />
                <span className="anong-body text-sm">{t.phone}</span>
              </div>
            </div>
          </div>
          
          {/* Newsletter & Connect Section - Simplified */}
          <div className="space-y-4">
            <h4 className="anong-subheading text-anong-gold text-lg font-medium">
              {t.newsletter}
            </h4>
            
            {/* Simple Newsletter Signup */}
            <form className="space-y-3" onSubmit={handleSubscribe}>
              <Input 
                type="email" 
                placeholder={t.email} 
                className="bg-anong-ivory/10 border-anong-gold/30 text-anong-ivory placeholder:text-anong-ivory/60 focus:border-anong-gold" 
                required 
              />
              <Button type="submit" className="w-full bg-anong-gold text-anong-black hover:bg-anong-gold/90">
                {t.submit}
              </Button>
            </form>
            
            {/* Social Media Icons */}
            <div className="flex space-x-3 pt-2">
              {[
                { href: "https://instagram.com", Icon: Instagram },
                { href: "https://facebook.com", Icon: Facebook },
                { href: "https://twitter.com", Icon: Twitter }
              ].map(({ href, Icon }) => (
                <a 
                  key={href} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 border border-anong-gold/30 rounded-full hover:border-anong-gold hover:bg-anong-gold/10 transition-all duration-300"
                >
                  <Icon className="h-4 w-4 text-anong-gold" />
                </a>
              ))}
            </div>
            
            {/* Legal Links */}
            <ul className="space-y-2 pt-2">
              {[
                { to: "/shipping", text: t.shipping },
                { to: "/returns", text: t.returns },
                { to: "/privacy", text: t.privacy },
                { to: "/terms", text: t.terms }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="anong-body text-xs text-anong-ivory/60 hover:text-anong-gold transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-anong-gold/20 pt-8 text-center">
          <p className="anong-body text-anong-ivory/80 text-sm">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
