
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
      tagline: "PREMIUM",
      subtitle: "ROOTED IN TRADITION. CRAFTED WITH GRACE.",
      description: "Authentic Thai curry pastes that elevate your culinary journey with premium ingredients and time-honored recipes.",
      cta: "Explore Collection",
      secondaryCta: "View Recipes"
    },
    th: {
      tagline: "พรีเมียม",
      subtitle: "รากฐานจากประเพณี สร้างสรรค์ด้วยความประณีต",
      description: "พริกแกงไทยแท้ที่ยกระดับการทำอาหารของคุณด้วยวัตถุดิบคุณภาพและสูตรดั้งเดิม",
      cta: "สำรวจคอลเลกชัน",
      secondaryCta: "ดูสูตรอาหาร"
    }
  };

  const t = translations[language];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
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
    <div className="relative w-full h-[700px] overflow-hidden watercolor-bg">
      {/* Premium background with subtle botanical elements */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('https://i.postimg.cc/Hx3gCZMh/buddah-fin.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4) contrast(1.1)"
        }}
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-l from-anong-deep-black/90 via-anong-dark-green/80 to-anong-charcoal/70"></div>
        {/* Botanical pattern overlay */}
        <div className="absolute inset-0 bg-botanical-pattern opacity-10"></div>
      </motion.div>
      
      {/* Content with premium typography */}
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="container mx-auto px-6">
          <motion.div 
            className="ml-auto max-w-3xl text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Premium tagline */}
            <motion.div 
              className="mb-4"
              variants={fadeIn}
            >
              <span className="font-elegant text-anong-gold text-lg md:text-xl tracking-[0.3em] uppercase">
                {t.tagline}
              </span>
              <div className="w-16 h-px bg-anong-gold mt-2"></div>
            </motion.div>

            {/* Main heading with premium serif typography */}
            <motion.h1 
              className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight drop-shadow-lg tracking-tight text-anong-cream"
              variants={fadeIn}
            >
              ANONG
            </motion.h1>
            
            {/* Elegant subtitle */}
            <motion.p 
              className="font-elegant text-lg md:text-2xl lg:text-3xl mb-6 text-anong-gold leading-relaxed tracking-wide"
              variants={fadeIn}
            >
              {t.subtitle}
            </motion.p>
            
            {/* Description with premium body font */}
            <motion.p 
              className="font-serif text-base md:text-lg lg:text-xl mb-10 text-anong-cream/90 leading-relaxed max-w-2xl"
              variants={fadeIn}
            >
              {t.description}
            </motion.p>
            
            {/* Premium CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              variants={fadeIn}
            >
              <Button 
                asChild
                size={isMobile ? "default" : "xl"}
                className="btn-gold shadow-xl hover:shadow-2xl text-lg px-12 py-6 h-auto"
              >
                <Link to="/shop" className="flex items-center">
                  {t.cta}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size={isMobile ? "default" : "xl"}
                className="text-anong-cream border-2 border-anong-cream/40 hover:border-anong-gold hover:bg-anong-gold/10 backdrop-blur-sm text-lg px-12 py-6 h-auto font-medium"
              >
                <Link to="/recipes">
                  {t.secondaryCta}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
