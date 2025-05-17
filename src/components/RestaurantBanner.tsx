
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
  
  // Pattern background for elegant overlay
  const patternBg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm0-2c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm0 4c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10zm0 2c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-20-20c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10zm0-2c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12-5.4-12-12-12zm40 40c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10zm0 2c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12z' fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`;
  
  return (
    <section className="relative overflow-hidden my-16 rounded-xl shadow-2xl">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          filter: "brightness(0.6)"
        }}
      >
        {/* Elegant pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: patternBg }}
        />
      </div>
      
      {/* Purple overlay with enhanced opacity and gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3b0b5a] via-[#520F7A] to-[#6a1f97] opacity-90"></div>
      
      {/* Content with improved typography and spacing */}
      <motion.div 
        className="relative container mx-auto px-4 py-24 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-display tracking-tight leading-tight"
          variants={itemVariants}
        >
          {t.title}
        </motion.h2>
        
        <motion.p 
          className="text-xl text-white/90 max-w-2xl mx-auto mb-8 font-light leading-relaxed"
          variants={itemVariants}
        >
          {t.subtitle}
        </motion.p>
        
        <motion.p 
          className="text-white/80 mb-3 font-light text-lg"
          variants={itemVariants}
        >
          20 Hettie Street, Cyrildene, Johannesburg, 2198
        </motion.p>
        
        <motion.p 
          className="text-white/80 mb-10 font-light"
          variants={itemVariants}
        >
          Anong: 076 505 9941 | Howard: 074 240 6712 | Justin: 072 102 0284
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Link to="/menu">
            <Button 
              className="bg-white text-[#520F7A] hover:bg-white/90 hover:text-[#520F7A] text-lg px-10 py-7 h-auto rounded-md transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/20"
              size="lg"
            >
              {t.button}
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RestaurantBanner;
