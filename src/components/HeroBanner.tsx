
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";

const HeroBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      tagline: "Authentic Thai Flavors, Crafted with Tradition",
      primaryCta: "Shop Now",
      secondaryCta: "Explore Recipes"
    },
    th: {
      tagline: "รสชาติไทยแท้ สร้างสรรค์ด้วยประเพณี",
      primaryCta: "ซื้อเลย",
      secondaryCta: "สำรวจสูตรอาหาร"
    }
  };

  const t = translations[language];

  // Refined, minimal animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="relative w-full h-[80vh] md:h-[85vh] overflow-hidden">
      {/* Enhanced background with reduced overlay */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('/lovable-uploads/a2767b76-0cad-45a5-b45f-d43c70c2d81c.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6) contrast(1.0) saturate(1.0)"
        }}
        initial={{ scale: 1.01 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        {/* Softer deep green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-deep-black/25 via-anong-dark-green/30 to-anong-charcoal/35"></div>
      </motion.div>
      
      {/* Centered, refined content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div 
            className="max-w-4xl mx-auto text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Refined tagline */}
            <motion.h1 
              className="font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-8 md:mb-12 leading-tight text-anong-cream tracking-tight"
              variants={fadeInUp}
            >
              {t.tagline}
            </motion.h1>
            
            {/* Elegant botanical divider */}
            <motion.div 
              className="flex items-center justify-center mb-10 md:mb-14"
              variants={fadeInUp}
            >
              <div className="w-16 md:w-24 h-px bg-anong-gold/60"></div>
              <div className="mx-6 md:mx-8 botanical-accent w-5 h-5 md:w-6 md:h-6 opacity-70"></div>
              <div className="w-16 md:w-24 h-px bg-anong-gold/60"></div>
            </motion.div>
            
            {/* Streamlined CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center"
              variants={fadeInUp}
            >
              <Button 
                asChild
                size="lg"
                className="btn-gold shadow-xl text-sm md:text-base px-8 md:px-12 py-4 md:py-6 h-auto font-medium tracking-wide"
              >
                <Link to="/shop" className="flex items-center">
                  {t.primaryCta}
                  <ArrowRight className="ml-2 md:ml-3 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size="lg"
                className="text-anong-cream border border-anong-cream/40 hover:border-anong-gold hover:bg-anong-gold/10 backdrop-blur-sm text-sm md:text-base px-8 md:px-12 py-4 md:py-6 h-auto font-medium tracking-wide transition-all duration-500"
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
