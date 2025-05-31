
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";

const HeroBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      tagline: "Authentic Thai Flavors",
      subtitle: "Crafted with Tradition & Heritage",
      description: "Premium curry pastes and sauces made from time-honored family recipes, bringing the soul of Thailand to your kitchen.",
      primaryCta: "Explore Our Collection",
      secondaryCta: "Discover Recipes"
    },
    th: {
      tagline: "รสชาติไทยแท้",
      subtitle: "สร้างสรรค์ด้วยประเพณีและมรดก",
      description: "พริกแกงและซอสพรีเมียมที่ทำจากสูตรครอบครัวดั้งเดิม นำจิตวิญญาณของไทยมาสู่ครัวของคุณ",
      primaryCta: "สำรวจคอลเลกชัน",
      secondaryCta: "ค้นพบสูตรอาหาร"
    }
  };

  const t = translations[language];

  // Premium animation variants with sophisticated easing
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1.4, 
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        damping: 20
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.4
      }
    }
  };

  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
      {/* Enhanced background with premium overlay treatment */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('/lovable-uploads/a2767b76-0cad-45a5-b45f-d43c70c2d81c.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.65) contrast(1.05) saturate(1.1)"
        }}
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      >
        {/* Sophisticated gradient overlay for premium feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-deep-black/30 via-anong-dark-green/25 to-anong-charcoal/35"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-anong-dark-green/20 via-transparent to-transparent"></div>
      </motion.div>
      
      {/* Premium content with enhanced typography hierarchy */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <motion.div 
            className="max-w-5xl mx-auto text-white content-spacing-lg"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Refined tagline with premium typography */}
            <motion.div 
              className="mb-8 md:mb-12"
              variants={fadeInUp}
            >
              <span className="font-elegant text-anong-gold text-base md:text-lg tracking-[0.3em] uppercase font-light block mb-4">
                Est. 2020
              </span>
              <h1 className="heading-premium text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-anong-cream mb-4 leading-[0.9]">
                {t.tagline}
              </h1>
              <h2 className="heading-elegant text-xl md:text-2xl lg:text-3xl text-anong-gold/90 font-light tracking-wide">
                {t.subtitle}
              </h2>
            </motion.div>
            
            {/* Enhanced description with premium typography */}
            <motion.p 
              className="text-luxury text-base md:text-lg lg:text-xl text-anong-cream/90 max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed"
              variants={fadeInUp}
            >
              {t.description}
            </motion.p>
            
            {/* Elegant botanical divider */}
            <motion.div 
              className="flex items-center justify-center mb-12 md:mb-16"
              variants={fadeInUp}
            >
              <div className="w-20 md:w-32 h-px bg-anong-gold/50"></div>
              <div className="mx-8 md:mx-12 botanical-accent w-6 h-6 md:w-8 md:h-8 opacity-80"></div>
              <div className="w-20 md:w-32 h-px bg-anong-gold/50"></div>
            </motion.div>
            
            {/* Premium CTA buttons with refined styling */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center"
              variants={fadeInUp}
            >
              <Button 
                asChild
                size="lg"
                className="btn-gold shadow-2xl text-sm md:text-base px-10 md:px-14 py-5 md:py-6 h-auto font-medium tracking-wide relative overflow-hidden group"
              >
                <Link to="/shop" className="flex items-center relative z-10">
                  <span className="mr-3">{t.primaryCta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size="lg"
                className="text-anong-cream border-2 border-anong-cream/50 hover:border-anong-gold hover:bg-anong-gold/15 backdrop-blur-md text-sm md:text-base px-10 md:px-14 py-5 md:py-6 h-auto font-medium tracking-wide transition-all duration-500 relative overflow-hidden group"
              >
                <Link to="/recipes" className="flex items-center relative z-10">
                  <span>{t.secondaryCta}</span>
                </Link>
              </Button>
            </motion.div>
            
            {/* Trust signals */}
            <motion.div 
              className="mt-16 md:mt-20 flex flex-wrap justify-center gap-4 md:gap-6"
              variants={fadeInUp}
            >
              <div className="trust-badge bg-anong-cream/10 text-anong-cream border-anong-cream/20">
                <span>Family Recipe</span>
              </div>
              <div className="trust-badge bg-anong-cream/10 text-anong-cream border-anong-cream/20">
                <span>Small Batch</span>
              </div>
              <div className="trust-badge bg-anong-cream/10 text-anong-cream border-anong-cream/20">
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
