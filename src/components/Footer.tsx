
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
      subscribe: "Subscribe to our newsletter",
      subscribeDesc: "Get the latest updates on new products and recipes",
      email: "Your email",
      submit: "Subscribe",
      shop: "Shop",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      recipes: "Recipes",
      about: "About Anong",
      contact: "Contact Us",
      visitUs: "Visit Our Restaurant",
      address: "123 Authentic Thai Street, Bangkok 10110",
      hours: "Daily: 11:00 AM - 10:00 PM",
      phone: "+66 2 123 4567",
      shipping: "Shipping Policy",
      returns: "Returns & Refunds",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "© 2025 Anong Thai Brand. All rights reserved."
    },
    th: {
      subscribe: "สมัครรับจดหมายข่าว",
      subscribeDesc: "รับข่าวสารล่าสุดเกี่ยวกับผลิตภัณฑ์และสูตรอาหารใหม่",
      email: "อีเมลของคุณ",
      submit: "ติดตาม",
      shop: "ซื้อสินค้า",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      recipes: "สูตรอาหาร",
      about: "เกี่ยวกับอนงค์",
      contact: "ติดต่อเรา",
      visitUs: "มาเยี่ยมชมร้านอาหารของเรา",
      address: "123 ถนนอาหารไทยแท้ กรุงเทพฯ 10110",
      hours: "ทุกวัน: 11:00 - 22:00 น.",
      phone: "+66 2 123 4567",
      shipping: "นโยบายการจัดส่ง",
      returns: "การคืนสินค้าและเงิน",
      privacy: "นโยบายความเป็นส่วนตัว",
      terms: "เงื่อนไขการใช้บริการ",
      rights: "© 2025 แบรนด์อาหารไทยอนงค์ สงวนลิขสิทธิ์ทั้งหมด"
    }
  };

  const t = translations[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'en' ? "Thank you for subscribing!" : "ขอบคุณสำหรับการติดตาม!",
      description: language === 'en' ? "You'll receive our next newsletter." : "คุณจะได้รับจดหมายข่าวฉบับต่อไปของเรา",
    });
  };

  return (
    <footer className={cn("bg-anong-dark-green text-anong-cream border-t border-anong-forest relative overflow-hidden", className)}>
      {/* Refined botanical background */}
      <div className="absolute inset-0 bg-botanical-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 watercolor-bg pointer-events-none"></div>
      
      {/* Elegant top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-anong-gold/60 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
      
        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <div className="mb-6">
            <span className="font-elegant text-anong-gold text-sm tracking-[0.2em] uppercase">
              Stay Connected
            </span>
            <div className="w-20 h-px bg-anong-gold mx-auto mt-3"></div>
          </div>
          
          <h3 className="heading-elegant text-2xl md:text-3xl text-anong-gold mb-4">
            {t.subscribe}
          </h3>
          <p className="text-luxury text-anong-cream/80 text-sm md:text-base mb-8 leading-relaxed">
            {t.subscribeDesc}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubscribe}>
            <Input 
              type="email" 
              placeholder={t.email} 
              className="input-premium flex-1 bg-anong-cream/10 border-anong-gold/30 text-anong-cream placeholder:text-anong-cream/60 focus:border-anong-gold" 
              required 
            />
            <Button type="submit" className="btn-gold whitespace-nowrap">
              {t.submit}
            </Button>
          </form>
        </div>

        {/* Premium botanical divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="w-24 h-px bg-anong-gold/50"></div>
          <div className="mx-8 botanical-accent w-6 h-6 opacity-70"></div>
          <div className="w-24 h-px bg-anong-gold/50"></div>
        </div>

        {/* Footer Links with Visit Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-sm">
          <div className="space-y-4">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base">{t.shop}</h4>
            <ul className="space-y-3">
              <li><Link to="/shop?category=curry-pastes" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.curryPastes}</Link></li>
              <li><Link to="/shop?category=stir-fry-sauces" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.stirFrySauces}</Link></li>
              <li><Link to="/shop?category=dipping-sauces" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.dippingSauces}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base">Anong Thai</h4>
            <ul className="space-y-3">
              <li><Link to="/recipes" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.recipes}</Link></li>
              <li><Link to="/about" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.about}</Link></li>
              <li><Link to="/contact" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.contact}</Link></li>
            </ul>
          </div>
          
          {/* Visit Us Restaurant Section */}
          <div className="space-y-4">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base">{t.visitUs}</h4>
            <div className="space-y-3 text-anong-cream/80">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-anong-gold mt-0.5 flex-shrink-0" />
                <span className="font-serif text-sm leading-relaxed">{t.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-anong-gold flex-shrink-0" />
                <span className="font-serif text-sm">{t.hours}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-anong-gold flex-shrink-0" />
                <span className="font-serif text-sm">{t.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="text-anong-gold hover:text-anong-warm-gold transition-colors duration-300 hover:scale-110 transform">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-anong-gold hover:text-anong-warm-gold transition-colors duration-300 hover:scale-110 transform">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="text-anong-gold hover:text-anong-warm-gold transition-colors duration-300 hover:scale-110 transform">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm">{t.shipping}</Link></li>
              <li><Link to="/returns" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm">{t.returns}</Link></li>
              <li><Link to="/privacy" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm">{t.privacy}</Link></li>
              <li><Link to="/terms" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm">{t.terms}</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright with botanical accent */}
        <div className="border-t border-anong-gold/20 pt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-px bg-anong-gold/30"></div>
            <div className="mx-4 botanical-accent w-4 h-4 opacity-50"></div>
            <div className="w-16 h-px bg-anong-gold/30"></div>
          </div>
          <p className="text-anong-cream/70 text-center text-xs font-serif tracking-wide">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
