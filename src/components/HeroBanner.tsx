
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroBanner = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  
  const translations = {
    en: {
      tagline: "Authentic Thai Cuisine",
      subtitle: "Premium Thai curry pastes & sauces using traditional recipes",
      cta: "Shop Now",
      secondaryCta: "Explore Recipes"
    },
    th: {
      tagline: "รสชาติไทยแท้ ที่สร้างสรรค์โดยอนงค์",
      subtitle: "พริกแกงและซอสไทยระดับพรีเมียมใช้สูตรดั้งเดิม",
      cta: "ซื้อเลย",
      secondaryCta: "ค้นหาสูตรอาหาร"
    }
  };

  const t = translations[language];

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Content moved to center with flex justify-center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl text-center">
            <h1 className={`font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight text-thai-purple`}>
              {t.tagline}
            </h1>
            <p className={`font-sarabun text-base md:text-xl lg:text-2xl mb-6 text-gray-700`}>
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                asChild
                size={isMobile ? "default" : "lg"}
              >
                <Link to="/shop">
                  {t.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size={isMobile ? "default" : "lg"}
              >
                <Link to="/recipes">
                  {t.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
