
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import MenuCarousel from "@/components/MenuCarousel";
import MenuGrid from "@/components/MenuGrid";
import { useEffect } from "react";

const Menu = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const translations = {
    en: {
      title: "Our Menu",
      description: "Explore our authentic Thai dishes made with fresh ingredients and traditional recipes.",
      menuPages: "Menu Pages",
      ourProducts: "Our Products"
    },
    th: {
      title: "เมนูของเรา",
      description: "สำรวจอาหารไทยแท้ของเราที่ทำจากวัตถุดิบสดและสูตรดั้งเดิม",
      menuPages: "หน้าเมนู",
      ourProducts: "ผลิตภัณฑ์ของเรา"
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

          {/* Menu Pages Carousel */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-anong-black mb-8 text-center font-serif">
              {t.menuPages}
            </h2>
            <MenuCarousel />
          </div>

          {/* Products Grid */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-anong-black mb-8 text-center font-serif">
              {t.ourProducts}
            </h2>
            <MenuGrid />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
