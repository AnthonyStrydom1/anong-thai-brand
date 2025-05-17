
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from "framer-motion";

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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Hero image with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://i.postimg.cc/Hx3gCZMh/buddah-fin.png')",
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-[#3b0b5a]/70 to-transparent"></div>
      </motion.div>
      
      {/* Content with animated entrance */}
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="container mx-auto px-6">
          <div className="ml-auto max-w-2xl text-white">
            <motion.h1 
              className={`font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight drop-shadow-md`}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {t.tagline}
            </motion.h1>
            <motion.p 
              className={`font-sarabun text-base md:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed`}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              {t.subtitle}
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Button 
                asChild
                size={isMobile ? "default" : "xl"}
                className="shadow-lg hover:shadow-purple-500/20 transition-all duration-500"
              >
                <Link to="/shop">
                  {t.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size={isMobile ? "default" : "xl"}
                className="text-white border border-white/30 hover:border-white backdrop-blur-sm"
              >
                <Link to="/recipes">
                  {t.secondaryCta}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
