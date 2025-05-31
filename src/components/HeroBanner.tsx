
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

  // Enhanced animation variants with more sophisticated timing
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
    <div className="relative w-full h-[88vh] md:h-[92vh] overflow-hidden">
      {/* Enhanced background with premium overlay treatment */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('/lovable-uploads/a2767b76-0cad-45a5-b45f-d43c70c2d81c.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "brightness(0.62) contrast(1.08) saturate(1.15)"
        }}
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 5, ease: "easeOut" }}
      >
        {/* Sophisticated gradient overlay for premium depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-deep-black/35 via-anong-dark-green/30 to-anong-charcoal/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-anong-dark-green/25 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-anong-deep-black/15 via-transparent to-anong-deep-black/10"></div>
      </motion.div>
      
      {/* Premium content with enhanced visual hierarchy */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <motion.div 
            className="max-w-6xl mx-auto text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Refined tagline with premium typography and better contrast */}
            <motion.div 
              className="mb-10 md:mb-14"
              variants={fadeInUp}
            >
              <span className="font-elegant text-anong-gold text-lg md:text-xl tracking-[0.35em] uppercase font-light block mb-5 drop-shadow-sm">
                Est. 2020
              </span>
              <h1 className="heading-premium text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-anong-cream mb-6 leading-[0.85] drop-shadow-lg">
                {t.tagline}
              </h1>
              <h2 className="heading-elegant text-2xl md:text-3xl lg:text-4xl text-anong-gold/95 font-light tracking-wide drop-shadow-md">
                {t.subtitle}
              </h2>
            </motion.div>
            
            {/* Enhanced description with better readability */}
            <motion.p 
              className="text-luxury text-lg md:text-xl lg:text-2xl text-anong-cream/95 max-w-4xl mx-auto mb-14 md:mb-18 leading-relaxed drop-shadow-sm font-light"
              variants={fadeInUp}
            >
              {t.description}
            </motion.p>
            
            {/* Elegant botanical divider with gold accents */}
            <motion.div 
              className="flex items-center justify-center mb-14 md:mb-18"
              variants={fadeInUp}
            >
              <div className="w-24 md:w-40 h-px bg-gradient-to-r from-transparent via-anong-gold/70 to-anong-gold/40"></div>
              <div className="mx-10 md:mx-14 botanical-accent w-8 h-8 md:w-10 md:h-10 opacity-90 drop-shadow-sm"></div>
              <div className="w-24 md:w-40 h-px bg-gradient-to-l from-transparent via-anong-gold/70 to-anong-gold/40"></div>
            </motion.div>
            
            {/* Premium CTA buttons with enhanced styling and better spacing */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-8 md:gap-10 justify-center items-center"
              variants={fadeInUp}
            >
              <Button 
                asChild
                size="lg"
                className="bg-anong-gold hover:bg-anong-warm-gold text-anong-deep-black shadow-2xl text-base md:text-lg px-12 md:px-16 py-6 md:py-7 h-auto font-medium tracking-wide relative overflow-hidden group border-2 border-anong-gold/20 min-h-[56px]"
              >
                <Link to="/shop" className="flex items-center relative z-10">
                  <span className="mr-4">{t.primaryCta}</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size="lg"
                className="text-anong-cream border-2 border-anong-cream/60 hover:border-anong-gold hover:bg-anong-gold/20 backdrop-blur-lg text-base md:text-lg px-12 md:px-16 py-6 md:py-7 h-auto font-medium tracking-wide transition-all duration-600 relative overflow-hidden group shadow-lg min-h-[56px]"
              >
                <Link to="/recipes" className="flex items-center relative z-10">
                  <span>{t.secondaryCta}</span>
                </Link>
              </Button>
            </motion.div>
            
            {/* Enhanced trust signals with better visual treatment */}
            <motion.div 
              className="mt-20 md:mt-24 flex flex-wrap justify-center gap-6 md:gap-8"
              variants={fadeInUp}
            >
              <div className="bg-anong-cream/15 text-anong-cream border border-anong-cream/30 px-6 py-3 rounded-full text-sm font-medium tracking-wide backdrop-blur-sm shadow-lg">
                <span>Family Recipe</span>
              </div>
              <div className="bg-anong-cream/15 text-anong-cream border border-anong-cream/30 px-6 py-3 rounded-full text-sm font-medium tracking-wide backdrop-blur-sm shadow-lg">
                <span>Small Batch</span>
              </div>
              <div className="bg-anong-cream/15 text-anong-cream border border-anong-cream/30 px-6 py-3 rounded-full text-sm font-medium tracking-wide backdrop-blur-sm shadow-lg">
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
