
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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }
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
    <div className="relative w-full h-[85vh] overflow-hidden">
      {/* Refined background with softer overlay */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('https://i.postimg.cc/Hx3gCZMh/buddah-fin.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.4) contrast(1.1) saturate(0.9)"
        }}
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      >
        {/* Softer, more premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-deep-black/75 via-anong-dark-green/60 to-anong-charcoal/70"></div>
        {/* Subtle botanical texture */}
        <div className="absolute inset-0 bg-botanical-pattern opacity-3"></div>
      </motion.div>
      
      {/* Centered, minimal content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            className="max-w-5xl mx-auto text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Simplified, powerful tagline */}
            <motion.h1 
              className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-12 leading-tight text-anong-cream tracking-tight max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              {t.tagline}
            </motion.h1>
            
            {/* Elegant botanical divider */}
            <motion.div 
              className="flex items-center justify-center mb-16"
              variants={fadeInUp}
            >
              <div className="w-24 h-px bg-anong-gold/60"></div>
              <div className="mx-8 botanical-accent w-6 h-6 opacity-70"></div>
              <div className="w-24 h-px bg-anong-gold/60"></div>
            </motion.div>
            
            {/* Streamlined CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center items-center"
              variants={fadeInUp}
            >
              <Button 
                asChild
                size="lg"
                className="btn-gold shadow-2xl text-base px-12 py-6 h-auto font-medium tracking-wide"
              >
                <Link to="/shop" className="flex items-center">
                  {t.primaryCta}
                  <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size="lg"
                className="text-anong-cream border border-anong-cream/40 hover:border-anong-gold hover:bg-anong-gold/10 backdrop-blur-sm text-base px-12 py-6 h-auto font-medium tracking-wide transition-all duration-500"
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
