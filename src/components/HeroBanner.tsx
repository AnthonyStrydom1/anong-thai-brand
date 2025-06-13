
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const HeroBanner = () => {
  const { language } = useLanguage();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Preload hero image immediately
  useEffect(() => {
    const img = new Image();
    img.src = '/lovable-uploads/214ef46d-cc98-40a7-9f35-00dff6eb2e36.png';
    img.onload = () => setIsImageLoaded(true);
  }, []);
  
  const translations = {
    en: {
      tagline: "Rooted in Tradition",
      subtitle: "Crafted with Grace",
      description: "Premium handcrafted Thai curry pastes and sauces made from time-honored family recipes, bringing the authentic soul of Thailand to your kitchen.",
      primaryCta: "Shop Collection",
      secondaryCta: "Explore Recipes",
      premiumQuality: "Premium Quality",
      handcrafted: "Handcrafted",
      authenticThai: "Authentic Thai"
    },
    th: {
      tagline: "หยั่งรากในประเพณี",
      subtitle: "สร้างสรรค์ด้วยความงดงาม",
      description: "พริกแกงและซอสไทยคุณภาพพรีเมียมที่ทำด้วยมือจากสูตรครอบครัวดั้งเดิม นำจิตวิญญาณไทยแท้มาสู่ครัวของคุณ",
      primaryCta: "ซื้อคอลเลคชั่น",
      secondaryCta: "สำรวจสูตรอาหาร",
      premiumQuality: "คุณภาพพรีเมียม",
      handcrafted: "งานฝีมือ",
      authenticThai: "ไทยแท้"
    }
  };

  const t = translations[language];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fast loading background with placeholder */}
      <div className="absolute inset-0 bg-anong-black">
        {/* Placeholder background while image loads */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-black/90 via-anong-charcoal/80 to-anong-deep-green/70" />
        
        {/* Hero image with optimized loading */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            backgroundImage: isImageLoaded ? "url('/lovable-uploads/214ef46d-cc98-40a7-9f35-00dff6eb2e36.png')" : 'none',
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.65) contrast(1.15)"
          }}
        >
          {/* Premium overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-anong-black/70 via-anong-black/50 to-anong-deep-green/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-anong-black/50 via-transparent to-transparent"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="container mx-auto text-center max-w-6xl">
          <motion.div 
            className="text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* ANONG logo display - load immediately */}
            <motion.div 
              className="mb-8 md:mb-12"
              variants={fadeInUp}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6">
                <img 
                  src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                  alt="ANONG Premium Logo"
                  className="w-full h-full object-contain drop-shadow-xl"
                  loading="eager"
                />
              </div>
              <h1 className="anong-heading text-3xl md:text-4xl text-anong-gold tracking-[0.2em] font-medium mb-2">
                ANONG
              </h1>
            </motion.div>

            {/* Brand tagline */}
            <motion.div 
              className="mb-8 md:mb-14"
              variants={fadeInUp}
            >
              <h2 className="anong-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-anong-ivory mb-4 md:mb-6 leading-[0.9] md:leading-[0.85] drop-shadow-lg px-2">
                {t.tagline}
              </h2>
              <h3 className="anong-subheading text-lg sm:text-xl md:text-3xl lg:text-4xl text-anong-gold/95 font-light tracking-wide drop-shadow-md px-2">
                {t.subtitle}
              </h3>
            </motion.div>
            
            {/* Description */}
            <motion.p 
              className="anong-body text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto mb-10 md:mb-18 leading-relaxed drop-shadow-sm font-light px-4"
              variants={fadeInUp}
            >
              {t.description}
            </motion.p>
            
            {/* Elegant Thai lotus divider */}
            <motion.div 
              className="flex items-center justify-center mb-10 md:mb-18"
              variants={fadeInUp}
            >
              <div className="w-16 sm:w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-anong-gold/70 to-anong-gold/40"></div>
              <div className="mx-6 sm:mx-10 md:mx-14 thai-lotus-divider w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 opacity-90 drop-shadow-sm"></div>
              <div className="w-16 sm:w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-anong-gold/70 to-anong-gold/40"></div>
            </motion.div>
            
            {/* CTA buttons */}
            <motion.div 
              className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 justify-center items-center px-4"
              variants={fadeInUp}
            >
              <Button 
                asChild
                size="lg"
                className="w-full sm:w-auto anong-btn-primary text-sm sm:text-base md:text-lg px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-7 h-auto font-semibold tracking-wide relative overflow-hidden group min-h-[48px] sm:min-h-[56px] rounded-full"
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
                className="w-full sm:w-auto text-white border-2 border-white/60 hover:border-anong-gold hover:bg-anong-gold/20 backdrop-blur-lg text-sm sm:text-base md:text-lg px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-7 h-auto font-medium tracking-wide transition-all duration-600 relative overflow-hidden group shadow-lg min-h-[48px] sm:min-h-[56px] rounded-full"
              >
                <Link to="/recipes" className="flex items-center justify-center relative z-10 w-full">
                  <span>{t.secondaryCta}</span>
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust badges */}
            <motion.div 
              className="mt-12 sm:mt-16 md:mt-24 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-4"
              variants={fadeInUp}
            >
              {[t.premiumQuality, t.handcrafted, t.authenticThai].map((badge, index) => (
                <div 
                  key={badge}
                  className="bg-white/15 text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm shadow-lg hover:bg-anong-gold/20 hover:border-anong-gold transition-all duration-300"
                >
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
