
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface FooterProps {
  currentLanguage: 'en' | 'th';
}

const Footer = ({ currentLanguage }: FooterProps) => {
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

  const t = translations[currentLanguage];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: currentLanguage === 'en' ? "Thank you for subscribing!" : "ขอบคุณสำหรับการติดตาม!",
      description: currentLanguage === 'en' ? "You'll receive our next newsletter." : "คุณจะได้รับจดหมายข่าวฉบับต่อไปของเรา",
    });
  };

  return (
    <footer className="bg-thai-purple-dark text-white border-t border-thai-purple">
      <div className="container mx-auto px-4 py-12">
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
            <Button type="submit" className="bg-thai-gold hover:bg-thai-gold/80 text-thai-purple-dark">
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
        <div className="border-t border-thai-purple/50 pt-8">
          <p className="text-gray-300 text-center text-sm">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
