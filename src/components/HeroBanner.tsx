
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
      tagline: "HERITAGE",
      heroTitle: "Authentic Thai Flavors",
      heroSubtitle: "Crafted with Tradition",
      description: "Premium curry pastes that honor centuries-old recipes, crafted with the finest ingredients for discerning palates.",
      primaryCta: "Shop Now",
      secondaryCta: "Explore Recipes"
    },
    th: {
      tagline: "มรดก",
      heroTitle: "รสชาติไทยแท้",
      heroSubtitle: "สร้างสรรค์ด้วยประเพณี",
      description: "พริกแกงพรีเมียมที่รักษาสูตรโบราณนับร้อยปี สร้างสรรค์ด้วยวัตถุดิบชั้นเยี่ยมสำหรับผู้ชื่นชมคุณภาพ",
      primaryCta: "ซื้อเลย",
      secondaryCta: "สำรวจสูตรอาหาร"
    }
  };

  const t = translations[language];

  // Refined animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
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
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Refined background with subtle overlay */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: "url('https://i.postimg.cc/Hx3gCZMh/buddah-fin.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.35) contrast(1.05)"
        }}
        initial={{ scale: 1.03 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
      >
        {/* Softer, more premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-anong-deep-black/85 via-anong-dark-green/75 to-anong-charcoal/60"></div>
        {/* Subtle botanical texture */}
        <div className="absolute inset-0 bg-botanical-pattern opacity-5"></div>
      </motion.div>
      
      {/* Centered, premium content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            className="max-w-4xl mx-auto text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Refined tagline */}
            <motion.div 
              className="mb-8"
              variants={fadeInUp}
            >
              <span className="font-elegant text-anong-gold text-base md:text-lg tracking-[0.4em] uppercase font-light">
                {t.tagline}
              </span>
              <div className="w-20 h-px bg-anong-gold mx-auto mt-3"></div>
            </motion.div>

            {/* Simplified, powerful headline */}
            <motion.h1 
              className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light mb-4 leading-tight text-anong-cream tracking-tight"
              variants={fadeInUp}
            >
              {t.heroTitle}
            </motion.h1>
            
            {/* Elegant subtitle */}
            <motion.h2 
              className="font-elegant text-xl md:text-3xl lg:text-4xl mb-12 text-anong-gold leading-relaxed tracking-wide font-light"
              variants={fadeInUp}
            >
              {t.heroSubtitle}
            </motion.h2>
            
            {/* Refined description */}
            <motion.p 
              className="font-serif text-lg md:text-xl lg:text-2xl mb-16 text-anong-cream/85 leading-relaxed max-w-3xl mx-auto font-light"
              variants={fadeInUp}
            >
              {t.description}
            </motion.p>
            
            {/* Streamlined CTA buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={fadeInUp}
            >
              <Button 
                asChild
                size="lg"
                className="btn-gold shadow-2xl text-lg px-16 py-8 h-auto font-medium tracking-wide"
              >
                <Link to="/shop" className="flex items-center">
                  {t.primaryCta}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="ghost" 
                size="lg"
                className="text-anong-cream border-2 border-anong-cream/30 hover:border-anong-gold hover:bg-anong-gold/5 backdrop-blur-sm text-lg px-16 py-8 h-auto font-medium tracking-wide"
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
