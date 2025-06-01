
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";

const HeroBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      tagline: "Rooted in Tradition",
      subtitle: "Crafted with Grace",
      description: "Premium handcrafted curry pastes made from time-honored family recipes, bringing the authentic soul of Thailand to your kitchen.",
      primaryCta: "Shop Now",
      secondaryCta: "Explore Recipes"
    },
    th: {
      tagline: "หยั่งรากในประเพณี",
      subtitle: "สร้างสรรค์ด้วยความงดงาม",
      description: "พริกแกงคุณภาพพรีเมียมที่ทำด้วยมือจากสูตรครอบครัวดั้งเดิม นำจิตวิญญาณไทยแท้มาสู่ครัวของคุณ",
      primaryCta: "ซื้อเลย",
      secondaryCta: "สำรวจสูตรอาหาร"
    }
  };

  const t = translations[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.6, 
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        damping: 25
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.5
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Hero background with new ANONG aesthetic */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('/lovable-uploads/214ef46d-cc98-40a7-9f35-00dff6eb2e36.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.7) contrast(1.1)"
        }}
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: "easeOut" }}
      >
        {/* Elegant overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-black/60 via-anong-black/40 to-anong-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-anong-black/40 via-transparent to-transparent"></div>
      </motion.div>
      
      {/* Premium content with ANONG branding */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="container mx-auto text-center max-w-6xl">
          <motion.div 
            className="text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* ANONG logo display */}
            <motion.div 
              className="mb-8 md:mb-12"
              variants={fadeInUp}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6">
                <img 
                  src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                  alt="ANONG Premium Logo"
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>
            </motion.div>

            {/* Brand tagline with elegant typography */}
            <motion.div 
              className="mb-8 md:mb-14"
              variants={fadeInUp}
            >
              <h1 className="heading-premium text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-anong-gold mb-4 md:mb-6 leading-[0.9] md:leading-[0.85] drop-shadow-lg px-2">
                {t.tagline}
              </h1>
              <h2 className="heading-elegant text-lg sm:text-xl md:text-3xl lg:text-4xl text-white/95 font-light tracking-wide drop-shadow-md px-2">
                {t.subtitle}
              </h2>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="text-luxury text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto mb-10 md:mb-18 leading-relaxed drop-shadow-sm font-light px-4"
              variants={fadeInUp}
            >
              {t.description}
            </motion.p>
            
            {/* Elegant lotus divider */}
            <motion.div 
              className="flex items-center justify-center mb-10 md:mb-18"
              variants={fadeInUp}
            >
              <div className="w-16 sm:w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-anong-gold/70 to-anong-gold/40"></div>
              <div className="mx-6 sm:mx-10 md:mx-14 lotus-accent w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-90 drop-shadow-sm"></div>
              <div className="w-16 sm:w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-anong-gold/70 to-anong-gold/40"></div>
            </motion.div>
            
            {/* Premium CTA buttons */}
            <motion.div 
              className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center items-center px-4"
              variants={fadeInUp}
            >
              <Button 
                asChild
                size="lg"
                className="w-full sm:w-auto bg-anong-gold hover:bg-anong-warm-yellow text-anong-black shadow-2xl text-sm sm:text-base md:text-lg px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-7 h-auto font-semibold tracking-wide relative overflow-hidden group border-2 border-anong-gold/20 min-h-[48px] sm:min-h-[56px]"
              >
                <Link to="/shop" className="flex items-center justify-center relative z-10 w-full">
                  <span className="mr-3 sm:mr-4">{t.primaryCta}</span>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size="lg"
                className="w-full sm:w-auto text-white border-2 border-white/60 hover:border-anong-gold hover:bg-anong-gold/20 backdrop-blur-lg text-sm sm:text-base md:text-lg px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-7 h-auto font-medium tracking-wide transition-all duration-600 relative overflow-hidden group shadow-lg min-h-[48px] sm:min-h-[56px]"
              >
                <Link to="/recipes" className="flex items-center justify-center relative z-10 w-full">
                  <span>{t.secondaryCta}</span>
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust signals */}
            <motion.div 
              className="mt-12 sm:mt-16 md:mt-24 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-4"
              variants={fadeInUp}
            >
              <div className="bg-white/15 text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm shadow-lg">
                <span>Premium Quality</span>
              </div>
              <div className="bg-white/15 text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm shadow-lg">
                <span>Handcrafted</span>
              </div>
              <div className="bg-white/15 text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm shadow-lg">
                <span>Authentic Thai</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
