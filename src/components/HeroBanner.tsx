
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';

const HeroBanner = () => {
  const { language } = useLanguage();
  
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
    <div className="relative h-[80vh] max-h-[600px] w-full overflow-hidden">
      {/* Hero image */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "https://i.postimg.cc/nzwcnB70/wat-arun.png" }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 h-full mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-black">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {t.tagline}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-thai-purple hover:bg-thai-purple-dark text-white"
            >
              <Link to="/shop">
                {t.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link to="/recipes">
                {t.secondaryCta}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Thai pattern border at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-4 thai-gradient"></div>
    </div>
  );
};

export default HeroBanner;
