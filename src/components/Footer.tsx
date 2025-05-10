
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
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
    <footer className="bg-[#520F7A] text-white border-t border-thai-purple thai-lotus-bg relative">
      <div className="absolute inset-0 opacity-80 mix-blend-overlay pattern-wavy pattern-thai-gold pattern-bg-transparent pattern-size-4 pattern-opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Thai decorative element at the top of the footer */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-6 relative">
            <div className="absolute inset-0 bg-thai-gold opacity-30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg width="120" height="16" viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60 0L65 4L70 0L75 4L80 0L85 4L90 0L95 4L100 0L105 4L110 0L115 4L120 0V2L115 6L110 2L105 6L100 2L95 6L90 2L85 6L80 2L75 6L70 2L65 6L60 2L55 6L50 2L45 6L40 2L35 6L30 2L25 6L20 2L15 6L10 2L5 6L0 2V0L5 4L10 0L15 4L20 0L25 4L30 0L35 4L40 0L45 4L50 0L55 4L60 0Z" fill="#D4AF37"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="max-w-2xl mx-auto mb-12">
          <h3 className="text-xl font-semibold text-center text-thai-gold mb-2">
            {t.subscribe}
          </h3>
          <p className="text-gray-200 text-center mb-4">
            {t.subscribeDesc}
          </p>
          <form className="flex gap-2" onSubmit={handleSubscribe}>
            <Input 
              type="email" 
              placeholder={t.email} 
              className="flex-1 bg-white/10 border-thai-gold/50 text-white placeholder:text-gray-300" 
              required 
            />
            <Button type="submit" className="bg-thai-gold hover:bg-thai-gold/80 text-[#520F7A]">
              {t.submit}
            </Button>
          </form>
        </div>

        {/* Footer links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-thai-gold">{t.shop}</h4>
            <ul className="space-y-2">
              <li><Link to="/shop?category=curry-pastes" className="text-gray-200 hover:text-thai-gold transition">{t.curryPastes}</Link></li>
              <li><Link to="/shop?category=stir-fry-sauces" className="text-gray-200 hover:text-thai-gold transition">{t.stirFrySauces}</Link></li>
              <li><Link to="/shop?category=dipping-sauces" className="text-gray-200 hover:text-thai-gold transition">{t.dippingSauces}</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-thai-gold">Anong Thai</h4>
            <ul className="space-y-2">
              <li><Link to="/recipes" className="text-gray-200 hover:text-thai-gold transition">{t.recipes}</Link></li>
              <li><Link to="/about" className="text-gray-200 hover:text-thai-gold transition">{t.about}</Link></li>
              <li><Link to="/contact" className="text-gray-200 hover:text-thai-gold transition">{t.contact}</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-thai-gold">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-gray-200 hover:text-thai-gold transition">{t.shipping}</Link></li>
              <li><Link to="/returns" className="text-gray-200 hover:text-thai-gold transition">{t.returns}</Link></li>
              <li><Link to="/privacy" className="text-gray-200 hover:text-thai-gold transition">{t.privacy}</Link></li>
              <li><Link to="/terms" className="text-gray-200 hover:text-thai-gold transition">{t.terms}</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-thai-gold">Anong Thai Brand</h4>
            <div className="flex space-x-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-thai-gold hover:text-thai-gold/80 transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-thai-gold hover:text-thai-gold/80 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-thai-gold hover:text-thai-gold/80 transition">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>


        {/* Copyright */}
        <div className="border-t border-white/20 pt-8">
          <p className="text-gray-300 text-center text-sm">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
