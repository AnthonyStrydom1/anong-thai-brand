
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from "lucide-react";
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
      {/* Premium background elements */}
      <div className="absolute inset-0 bg-botanical-pattern opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 watercolor-bg pointer-events-none"></div>
      
      {/* Elegant top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
      
        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <div className="mb-4">
            <span className="font-elegant text-anong-gold text-sm tracking-[0.2em] uppercase">
              Stay Connected
            </span>
            <div className="w-16 h-px bg-anong-gold mx-auto mt-2"></div>
          </div>
          
          <h3 className="heading-elegant text-xl md:text-2xl text-anong-gold mb-3">
            {t.subscribe}
          </h3>
          <p className="text-luxury text-anong-cream/80 text-sm mb-6 leading-relaxed">
            {t.subscribeDesc}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
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

        {/* Botanical divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-px bg-anong-gold/40"></div>
          <div className="mx-6 botanical-accent w-5 h-5 opacity-60"></div>
          <div className="w-20 h-px bg-anong-gold/40"></div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-sm">
          <div className="space-y-3">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide">{t.shop}</h4>
            <ul className="space-y-2">
              <li><Link to="/shop?category=curry-pastes" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.curryPastes}</Link></li>
              <li><Link to="/shop?category=stir-fry-sauces" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.stirFrySauces}</Link></li>
              <li><Link to="/shop?category=dipping-sauces" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.dippingSauces}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide">Anong Thai</h4>
            <ul className="space-y-2">
              <li><Link to="/recipes" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.recipes}</Link></li>
              <li><Link to="/about" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.about}</Link></li>
              <li><Link to="/contact" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.contact}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.shipping}</Link></li>
              <li><Link to="/returns" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.returns}</Link></li>
              <li><Link to="/privacy" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.privacy}</Link></li>
              <li><Link to="/terms" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif">{t.terms}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide">Connect</h4>
            <div className="flex space-x-4">
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
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-anong-gold/20 pt-6">
          <p className="text-anong-cream/70 text-center text-xs font-serif tracking-wide">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
