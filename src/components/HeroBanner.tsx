
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
      {/* Hero image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://i.postimg.cc/NfVF2Mnj/Buddah.png')",
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl text-white">
            <h1 className={`font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight`}>
              {t.tagline}
            </h1>
            <p className={`font-sarabun text-base md:text-xl lg:text-2xl mb-6 text-white/90`}>
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
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
                variant="ghost" 
                size={isMobile ? "default" : "lg"}
                className="text-white border border-white"
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
