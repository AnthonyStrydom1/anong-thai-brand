
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
      subscribe: "Join Our Culinary Journey",
      subscribeDesc: "Receive exclusive recipes, cooking tips, and first access to new authentic Thai products crafted with traditional methods.",
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
      rights: "© 2025 ANONG Thai Brand. Crafted with tradition, delivered with love.",
      quality: "Premium Quality",
      authentic: "Family Recipes",
      crafted: "Handcrafted"
    },
    th: {
      newsletter: "ติดตามข่าวสาร",
      subscribe: "ร่วมเดินทางอาหารกับเรา",
      subscribeDesc: "รับสูตรอาหารพิเศษ เทคนิคการทำอาหาร และสิทธิพิเศษในผลิตภัณฑ์ไทยแท้ที่สร้างด้วยวิธีดั้งเดิม",
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
      rights: "© 2025 แบรนด์อาหารไทยอนงค์ สร้างด้วยประเพณี ส่งมอบด้วยความรัก",
      quality: "คุณภาพพรีเมียม",
      authentic: "สูตรครอบครัว",
      crafted: "งานฝีมือ"
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
    <footer className={cn("green-banner-bg text-anong-cream relative overflow-hidden", className)}>
      {/* Premium top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-anong-gold/80 to-transparent"></div>
      
      <div className="container mx-auto px-6 md:px-8 py-16 md:py-20 relative z-10">
      
        {/* Premium Newsletter Section */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20 text-center content-spacing">
          <div className="mb-8">
            <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.25em] uppercase font-light">
              {t.newsletter}
            </span>
            <div className="w-20 h-px bg-anong-gold mx-auto mt-4"></div>
          </div>
          
          <h3 className="heading-elegant text-2xl md:text-3xl lg:text-4xl text-anong-gold mb-6 leading-tight">
            {t.subscribe}
          </h3>
          <p className="text-luxury text-sm md:text-base text-anong-cream/85 mb-10 leading-relaxed max-w-2xl mx-auto">
            {t.subscribeDesc}
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={handleSubscribe}>
            <Input 
              type="email" 
              placeholder={t.email} 
              className="input-premium flex-1 bg-anong-cream/15 border-anong-gold/30 text-anong-cream placeholder:text-anong-cream/60 focus:border-anong-gold backdrop-blur-sm" 
              required 
            />
            <Button type="submit" className="btn-gold whitespace-nowrap px-8 py-4">
              {t.submit}
            </Button>
          </form>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="trust-badge bg-anong-cream/10 text-anong-cream border-anong-cream/20">
              {t.quality}
            </div>
            <div className="trust-badge bg-anong-cream/10 text-anong-cream border-anong-cream/20">
              {t.authentic}
            </div>
            <div className="trust-badge bg-anong-cream/10 text-anong-cream border-anong-cream/20">
              {t.crafted}
            </div>
          </div>
        </div>

        {/* Elegant botanical divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="w-24 md:w-32 h-px bg-anong-gold/60"></div>
          <div className="mx-8 md:mx-12 botanical-accent w-8 h-8 opacity-90"></div>
          <div className="w-24 md:w-32 h-px bg-anong-gold/60"></div>
        </div>

        {/* Premium Footer Links with Restaurant Integration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16 text-sm">
          <div className="space-y-5">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base md:text-lg">{t.shop}</h4>
            <ul className="space-y-3">
              <li><Link to="/shop?category=curry-pastes" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif hover:translate-x-1 transform inline-block">{t.curryPastes}</Link></li>
              <li><Link to="/shop?category=stir-fry-sauces" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif hover:translate-x-1 transform inline-block">{t.stirFrySauces}</Link></li>
              <li><Link to="/shop?category=dipping-sauces" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif hover:translate-x-1 transform inline-block">{t.dippingSauces}</Link></li>
            </ul>
          </div>
          
          <div className="space-y-5">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base md:text-lg">ANONG</h4>
            <ul className="space-y-3">
              <li><Link to="/recipes" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif hover:translate-x-1 transform inline-block">{t.recipes}</Link></li>
              <li><Link to="/about" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif hover:translate-x-1 transform inline-block">{t.about}</Link></li>
              <li><Link to="/contact" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif hover:translate-x-1 transform inline-block">{t.contact}</Link></li>
            </ul>
          </div>
          
          {/* Enhanced Visit Restaurant Section */}
          <div className="space-y-5">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base md:text-lg">{t.visitUs}</h4>
            <div className="space-y-4 text-anong-cream/80">
              <div className="flex items-start space-x-3 group">
                <MapPin className="h-4 w-4 text-anong-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-serif text-sm leading-relaxed">{t.address}</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Clock className="h-4 w-4 text-anong-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-serif text-sm">{t.hours}</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="h-4 w-4 text-anong-gold flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-serif text-sm">{t.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-5">
            <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-base md:text-lg">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="text-anong-gold hover:text-anong-warm-gold transition-all duration-300 hover:scale-125 transform p-2 rounded-full hover:bg-anong-gold/10">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-anong-gold hover:text-anong-warm-gold transition-all duration-300 hover:scale-125 transform p-2 rounded-full hover:bg-anong-gold/10">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="text-anong-gold hover:text-anong-warm-gold transition-all duration-300 hover:scale-125 transform p-2 rounded-full hover:bg-anong-gold/10">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <ul className="space-y-3">
              <li><Link to="/shipping" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm hover:translate-x-1 transform inline-block">{t.shipping}</Link></li>
              <li><Link to="/returns" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm hover:translate-x-1 transform inline-block">{t.returns}</Link></li>
              <li><Link to="/privacy" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm hover:translate-x-1 transform inline-block">{t.privacy}</Link></li>
              <li><Link to="/terms" className="text-anong-cream/80 hover:text-anong-gold transition-colors duration-300 font-serif text-sm hover:translate-x-1 transform inline-block">{t.terms}</Link></li>
            </ul>
          </div>
        </div>

        {/* Premium Copyright Section */}
        <div className="border-t border-anong-gold/20 pt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 md:w-24 h-px bg-anong-gold/40"></div>
            <div className="mx-6 md:mx-8 botanical-accent w-5 h-5 opacity-70"></div>
            <div className="w-16 md:w-24 h-px bg-anong-gold/40"></div>
          </div>
          <p className="text-anong-cream/70 text-center text-sm md:text-base font-serif tracking-wide leading-relaxed max-w-2xl mx-auto">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
