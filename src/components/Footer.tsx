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
    <footer className={cn("relative overflow-hidden bg-gradient-to-br from-anong-black via-gray-900 to-anong-black", className)}>
      {/* Enhanced Thai-inspired background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23d4af37' stroke-width='1' opacity='0.4'%3E%3Cpath d='M60 30c0 0-15 15-15 30s15 30 15 30 15-15 15-30-15-30-15-30z'/%3E%3Cpath d='M30 60c0 0 15-15 30-15s30 15 30 15-15 15-30 15-30-15-30-15z'/%3E%3Ccircle cx='60' cy='60' r='3' fill='%23d4af37'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}></div>
      </div>

      {/* Decorative top border with animated gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-anong-gold to-transparent">
        <div className="h-full bg-gradient-to-r from-anong-gold via-anong-warm-yellow to-anong-gold animate-pulse opacity-80"></div>
      </div>
      
      {/* Content wrapper with enhanced spacing */}
      <div className="container mx-auto px-6 md:px-8 py-20 md:py-24 relative z-10">
        
        {/* Enhanced Newsletter Section with premium card styling */}
        <div className="max-w-4xl mx-auto mb-20 md:mb-24">
          <div className="relative bg-gradient-to-br from-anong-gold/5 to-anong-warm-yellow/5 rounded-3xl p-8 md:p-12 border border-anong-gold/20 backdrop-blur-sm">
            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-anong-gold/40 rounded-tl-lg"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-anong-gold/40 rounded-tr-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-anong-gold/40 rounded-bl-lg"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-anong-gold/40 rounded-br-lg"></div>
            
            <div className="text-center">
              <div className="mb-8">
                <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.3em] uppercase font-light">
                  {t.newsletter}
                </span>
                <div className="flex items-center justify-center mt-4">
                  <div className="w-16 h-px bg-anong-gold/60"></div>
                  <div className="mx-4 w-2 h-2 bg-anong-gold rounded-full"></div>
                  <div className="w-16 h-px bg-anong-gold/60"></div>
                </div>
              </div>
              
              <h3 className="heading-elegant text-3xl md:text-4xl lg:text-5xl text-anong-gold mb-6 leading-tight">
                {t.subscribe}
              </h3>
              <p className="text-luxury text-base md:text-lg text-anong-ivory/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                {t.subscribeDesc}
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8" onSubmit={handleSubscribe}>
                <Input 
                  type="email" 
                  placeholder={t.email} 
                  className="input-premium flex-1 bg-anong-ivory/10 border-anong-gold/40 text-anong-ivory placeholder:text-anong-ivory/70 focus:border-anong-gold focus:bg-anong-ivory/15 backdrop-blur-sm h-14 px-6 text-lg" 
                  required 
                />
                <Button type="submit" className="btn-gold h-14 px-10 text-lg font-medium tracking-wide hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  {t.submit}
                </Button>
              </form>
              
              {/* Enhanced trust badges with animations */}
              <div className="flex flex-wrap justify-center gap-4">
                {[t.quality, t.authentic, t.crafted].map((badge, index) => (
                  <div key={badge} className={`bg-anong-ivory/10 text-anong-ivory border border-anong-ivory/30 px-6 py-3 rounded-full text-sm font-medium tracking-wide backdrop-blur-sm hover:bg-anong-gold/20 hover:border-anong-gold/60 transition-all duration-300 hover:scale-105 animate-fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced botanical divider with Thai motifs */}
        <div className="flex items-center justify-center mb-20 md:mb-24">
          <div className="w-32 md:w-40 h-px bg-gradient-to-r from-transparent to-anong-gold/60"></div>
          <div className="mx-8 md:mx-12 relative">
            <div className="lotus-accent w-12 h-12 opacity-90"></div>
            <div className="absolute inset-0 w-12 h-12 border border-anong-gold/30 rounded-full animate-pulse"></div>
          </div>
          <div className="w-32 md:w-40 h-px bg-gradient-to-l from-transparent to-anong-gold/60"></div>
        </div>

        {/* Enhanced Footer Links with better visual hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-20 text-sm">
          {[
            {
              title: t.shop,
              links: [
                { to: "/shop?category=curry-pastes", text: t.curryPastes },
                { to: "/shop?category=stir-fry-sauces", text: t.stirFrySauces },
                { to: "/shop?category=dipping-sauces", text: t.dippingSauces }
              ]
            },
            {
              title: "ANONG",
              links: [
                { to: "/recipes", text: t.recipes },
                { to: "/about", text: t.about },
                { to: "/contact", text: t.contact }
              ]
            }
          ].map((section, sectionIndex) => (
            <div key={section.title} className="space-y-6 group">
              <div className="relative">
                <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-lg md:text-xl mb-2">
                  {section.title}
                </h4>
                <div className="w-12 h-0.5 bg-anong-gold/60 group-hover:w-20 transition-all duration-300"></div>
              </div>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-anong-ivory/80 hover:text-anong-gold transition-all duration-300 font-serif hover:translate-x-2 transform inline-block relative group/link text-base"
                    >
                      <span className="relative z-10">{link.text}</span>
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-anong-gold group-hover/link:w-full transition-all duration-300"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Enhanced Visit Restaurant Section with premium styling */}
          <div className="space-y-6 group">
            <div className="relative">
              <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-lg md:text-xl mb-2">
                {t.visitUs}
              </h4>
              <div className="w-12 h-0.5 bg-anong-gold/60 group-hover:w-20 transition-all duration-300"></div>
            </div>
            <div className="space-y-5 text-anong-ivory/85">
              <div className="flex items-start space-x-4 group/item hover:bg-anong-gold/5 p-3 rounded-lg transition-all duration-300">
                <MapPin className="h-5 w-5 text-anong-gold mt-1 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
                <span className="font-serif text-base leading-relaxed">{t.address}</span>
              </div>
              <div className="flex items-center space-x-4 group/item hover:bg-anong-gold/5 p-3 rounded-lg transition-all duration-300">
                <Clock className="h-5 w-5 text-anong-gold flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
                <span className="font-serif text-base">{t.hours}</span>
              </div>
              <div className="flex items-center space-x-4 group/item hover:bg-anong-gold/5 p-3 rounded-lg transition-all duration-300">
                <Phone className="h-5 w-5 text-anong-gold flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
                <span className="font-serif text-base">{t.phone}</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Connect section */}
          <div className="space-y-6 group">
            <div className="relative">
              <h4 className="heading-elegant text-anong-gold font-medium tracking-wide text-lg md:text-xl mb-2">
                Connect
              </h4>
              <div className="w-12 h-0.5 bg-anong-gold/60 group-hover:w-20 transition-all duration-300"></div>
            </div>
            
            {/* Enhanced social media icons */}
            <div className="flex space-x-4 mb-8">
              {[
                { href: "https://instagram.com", Icon: Instagram },
                { href: "https://facebook.com", Icon: Facebook },
                { href: "https://twitter.com", Icon: Twitter }
              ].map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer" 
                   className="relative group/social p-3 rounded-full border border-anong-gold/30 hover:border-anong-gold transition-all duration-300 hover:scale-110 hover:bg-anong-gold/10">
                  <Icon className="h-6 w-6 text-anong-gold group-hover/social:text-anong-warm-yellow transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-full bg-anong-gold/0 group-hover/social:bg-anong-gold/5 transition-all duration-300"></div>
                </a>
              ))}
            </div>
            
            <ul className="space-y-4">
              {[
                { to: "/shipping", text: t.shipping },
                { to: "/returns", text: t.returns },
                { to: "/privacy", text: t.privacy },
                { to: "/terms", text: t.terms }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-anong-ivory/80 hover:text-anong-gold transition-all duration-300 font-serif text-base hover:translate-x-2 transform inline-block relative group/link"
                  >
                    <span className="relative z-10">{link.text}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-anong-gold group-hover/link:w-full transition-all duration-300"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Copyright Section with premium styling */}
        <div className="relative">
          <div className="border-t border-anong-gold/30 pt-12">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 md:w-32 h-px bg-gradient-to-r from-transparent to-anong-gold/50"></div>
              <div className="mx-8 md:mx-12 relative">
                <div className="lotus-accent w-8 h-8 opacity-80"></div>
                <div className="absolute inset-0 w-8 h-8 border border-anong-gold/20 rounded-full"></div>
              </div>
              <div className="w-24 md:w-32 h-px bg-gradient-to-l from-transparent to-anong-gold/50"></div>
            </div>
            <p className="text-anong-ivory/80 text-center text-base md:text-lg font-serif tracking-wide leading-relaxed max-w-3xl mx-auto">
              {t.rights}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-anong-gold/20 via-anong-warm-yellow/30 to-anong-gold/20"></div>
    </footer>
  );
};

export default Footer;
