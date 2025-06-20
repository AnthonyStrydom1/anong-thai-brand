
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
      description: "สำรวจอาหารไทยแท้ของเราที่ทำจากวัตถุดิบสดและสูตรดั้งเดิม",
      viewMenu: "ดูเมนูทั้งหมด",
    }
  };
  
  const t = translations[language];
  
  return (
    <section className="py-16 bg-anong-cream">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg">
          {/* Background */}
          <div className="absolute inset-0 bg-anong-deep-green"></div>
          
          {/* Content */}
          <div className="relative px-6 py-12 md:px-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-anong-cream mb-4">{t.title}</h2>
            <p className="text-anong-cream text-lg max-w-2xl mx-auto mb-8">{t.description}</p>
            
            <Link to="/menu">
              <Button className="bg-anong-gold hover:bg-anong-gold/90 text-anong-deep-green group">
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
