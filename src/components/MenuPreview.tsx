
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MenuCarousel from "./MenuCarousel";

const MenuPreview = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Our Menu",
      description: "Explore our authentic Thai dishes made with fresh ingredients and traditional recipes.",
      viewMenu: "View Full Menu",
    },
    th: {
      title: "เมนูของเรา",
      description: "สำรวจอาหารไทยแท้ๆของเราที่ทำจากวัตถุดิบสดและสูตรดั้งเดิม",
      viewMenu: "ดูเมนูทั้งหมด",
    }
  };
  
  const t = translations[language];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#520F7A] mb-4">{t.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.description}</p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <MenuCarousel />
          
          <div className="mt-8 text-center">
            <Link to="/menu">
              <Button className="bg-thai-gold hover:bg-thai-gold/90 text-[#520F7A] group">
                {t.viewMenu}
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
