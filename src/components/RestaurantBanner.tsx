
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
      tagline: "EXPERIENCE AUTHENTIC",
      title: "ANONG Thai Restaurant",
      subtitle: "Traditional Thai cuisine crafted with fresh ingredients and time-honored recipes",
      button: "View Restaurant Details",
    },
    th: {
      tagline: "สัมผัสความแท้จริง",
      title: "ร้านอาหารไทยอนงค์",
      subtitle: "อาหารไทยดั้งเดิม สร้างสรรค์ด้วยวัตถุดิบสดใหม่และสูตรโบราณ",
      button: "ดูรายละเอียดร้านอาหาร",
    }
  };
  
  const t = translations[language];
  
  // Soft animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.3 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };
  
  return (
    <section className="relative overflow-hidden my-20 rounded-2xl shadow-2xl luxury-card mx-4 md:mx-0">
      {/* Refined background with deep green gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-anong-dark-green via-anong-forest to-anong-dark-green">
        {/* Enhanced botanical pattern overlay */}
        <div className="absolute inset-0 bg-botanical-pattern opacity-15"></div>
        {/* Subtle watercolor texture */}
        <div className="absolute inset-0 watercolor-bg opacity-20"></div>
      </div>
      
      {/* Elegant decorative border */}
      <div className="absolute inset-0 border border-anong-gold/20 rounded-2xl"></div>
      
      {/* Refined content with premium typography */}
      <motion.div 
        className="relative container mx-auto px-8 py-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Elegant tagline */}
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.3em] uppercase font-light">
            {t.tagline}
          </span>
          <div className="w-16 h-px bg-anong-gold mx-auto mt-3"></div>
        </motion.div>

        <motion.h2 
          className="heading-premium text-3xl md:text-4xl lg:text-5xl text-anong-cream mb-8 leading-tight font-light"
          variants={itemVariants}
        >
          {t.title}
        </motion.h2>
        
        <motion.p 
          className="text-luxury text-base md:text-lg text-anong-cream/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          variants={itemVariants}
        >
          {t.subtitle}
        </motion.p>
        
        {/* Refined contact information */}
        <motion.div className="space-y-2 mb-10" variants={itemVariants}>
          <p className="text-anong-cream/85 font-serif text-sm">
            20 Hettie Street, Cyrildene, Johannesburg, 2198
          </p>
          <p className="text-anong-cream/85 font-serif text-sm">
            Anong: 076 505 9941 | Howard: 074 240 6712 | Justin: 072 102 0284
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Link to="/menu">
            <Button 
              className="btn-gold text-base px-10 py-5 h-auto shadow-xl hover:shadow-2xl border border-anong-gold/20 font-medium tracking-wide"
              size="lg"
            >
              {t.button}
              <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RestaurantBanner;
