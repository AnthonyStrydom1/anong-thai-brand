
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import MenuGrid from "@/components/MenuGrid";
import { useEffect } from "react";

const Menu = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts - with timeout to ensure it works
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    // Backup scroll in case the first one doesn't work
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const translations = {
    en: {
      title: "Our Menu",
      description: "Explore our authentic Thai dishes made with fresh ingredients and traditional recipes."
    },
    th: {
      title: "เมนูของเรา",
      description: "สำรวจอาหารไทยแท้ของเราที่ทำจากวัตถุดิบสดและสูตรดั้งเดิม"
    }
  };

  const t = translations[language];
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow thai-pattern-bg">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-anong-black mb-4 font-serif">
              {t.title}
            </h1>
            <p className="text-lg text-anong-black/70 max-w-2xl mx-auto">
              {t.description}
            </p>
          </div>

          {/* Menu Items Grid */}
          <MenuGrid />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
