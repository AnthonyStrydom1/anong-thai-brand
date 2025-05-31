
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const RestaurantBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Anong Thai Restaurant",
      subtitle: "Authentic Thai cuisine made with fresh ingredients and traditional recipes",
      button: "View Our Restaurant",
    },
    th: {
      title: "ลองร้านอาหารของเรา",
      subtitle: "อาหารไทยแท้ๆ ทำจากวัตถุดิบสดและสูตรดั้งเดิม",
      button: "ดูร้านอาหารของเรา",
    }
  };
  
  const t = translations[language];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <section className="relative overflow-hidden my-16 rounded-xl shadow-2xl luxury-card">
      {/* Premium background with botanical overlay */}
      <div className="absolute inset-0 dark-premium-gradient">
        {/* Botanical pattern overlay */}
        <div className="absolute inset-0 bg-botanical-pattern opacity-20"></div>
        {/* Watercolor texture */}
        <div className="absolute inset-0 watercolor-bg"></div>
      </div>
      
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-anong-dark-green/95 via-anong-forest/90 to-anong-dark-green/95"></div>
      
      {/* Elegant decorative border */}
      <div className="absolute inset-0 border border-anong-gold/30 rounded-xl"></div>
      
      {/* Content with premium typography */}
      <motion.div 
        className="relative container mx-auto px-6 py-24 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Premium accent */}
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.2em] uppercase">
            Experience Authentic
          </span>
          <div className="w-20 h-px bg-anong-gold mx-auto mt-2"></div>
        </motion.div>

        <motion.h2 
          className="heading-premium text-4xl md:text-5xl lg:text-6xl text-anong-cream mb-6 leading-tight"
          variants={itemVariants}
        >
          {t.title}
        </motion.h2>
        
        <motion.p 
          className="text-luxury text-lg md:text-xl text-anong-cream/90 max-w-2xl mx-auto mb-8 leading-relaxed"
          variants={itemVariants}
        >
          {t.subtitle}
        </motion.p>
        
        {/* Botanical divider */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          variants={itemVariants}
        >
          <div className="w-12 h-px bg-anong-gold/60"></div>
          <div className="mx-4 botanical-accent w-4 h-4 opacity-80"></div>
          <div className="w-12 h-px bg-anong-gold/60"></div>
        </motion.div>
        
        <motion.p 
          className="text-anong-cream/80 mb-3 font-serif text-lg"
          variants={itemVariants}
        >
          20 Hettie Street, Cyrildene, Johannesburg, 2198
        </motion.p>
        
        <motion.p 
          className="text-anong-cream/80 mb-10 font-serif"
          variants={itemVariants}
        >
          Anong: 076 505 9941 | Howard: 074 240 6712 | Justin: 072 102 0284
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Link to="/menu">
            <Button 
              className="btn-gold text-lg px-12 py-6 h-auto shadow-2xl hover:shadow-3xl border border-anong-gold/20"
              size="lg"
            >
              {t.button}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RestaurantBanner;
