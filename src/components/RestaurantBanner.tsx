
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const RestaurantBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      tagline: "EXPERIENCE AUTHENTIC",
      title: "ANONG Thai Restaurant",
      subtitle: "Where tradition meets culinary artistry. Experience the authentic flavors of Thailand crafted with premium ingredients and time-honored family recipes.",
      button: "Reserve Your Table",
      location: "20 Hettie Street, Cyrildene, Johannesburg",
      hours: "Open Daily 11:00 AM - 10:00 PM",
      contact: "Call for Reservations"
    },
    th: {
      tagline: "สัมผัสความแท้จริง",
      title: "ร้านอาหารไทยอนงค์",
      subtitle: "ที่ซึ่งประเพณีพบกับศิลปะการทำอาหาร สัมผัสรสชาติไทยแท้ที่สร้างด้วยวัตถุดิบพรีเมียมและสูตรครอบครัวโบราณ",
      button: "จองโต๊ะของคุณ",
      location: "20 เฮตตี้ สตรีท ไซริลดีน โจฮันเนสเบิร์ก",
      hours: "เปิดทุกวัน 11:00 - 22:00 น.",
      contact: "โทรจองโต๊ะ"
    }
  };
  
  const t = translations[language];
  
  // Premium animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 1,
        staggerChildren: 0.4 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }
    }
  };
  
  return (
    <section className="relative overflow-hidden my-24 md:my-32 rounded-3xl shadow-2xl luxury-card mx-6 md:mx-8">
      {/* Enhanced background with sophisticated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-anong-dark-green via-anong-forest to-anong-dark-green/95">
        {/* Premium botanical pattern overlay */}
        <div className="absolute inset-0 bg-botanical-pattern opacity-12"></div>
        {/* Artistic watercolor texture */}
        <div className="absolute inset-0 watercolor-bg opacity-25"></div>
        {/* Subtle radial overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-anong-dark-green/10 to-anong-dark-green/30"></div>
      </div>
      
      {/* Premium decorative border */}
      <div className="absolute inset-0 border-2 border-anong-gold/15 rounded-3xl"></div>
      
      {/* Enhanced content with premium spacing */}
      <motion.div 
        className="relative container mx-auto px-8 md:px-12 py-20 md:py-28 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Premium tagline with enhanced styling */}
        <motion.div 
          className="mb-8 md:mb-12"
          variants={itemVariants}
        >
          <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.35em] uppercase font-light">
            {t.tagline}
          </span>
          <div className="w-20 h-px bg-anong-gold mx-auto mt-4"></div>
        </motion.div>

        <motion.h2 
          className="heading-premium text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-anong-cream mb-8 md:mb-12 leading-tight font-light"
          variants={itemVariants}
        >
          {t.title}
        </motion.h2>
        
        <motion.p 
          className="text-luxury text-base md:text-lg lg:text-xl text-anong-cream/90 max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed font-light"
          variants={itemVariants}
        >
          {t.subtitle}
        </motion.p>
        
        {/* Enhanced contact information with premium icons */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 max-w-4xl mx-auto" variants={itemVariants}>
          <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-anong-cream/5 backdrop-blur-sm border border-anong-gold/10">
            <MapPin className="h-6 w-6 text-anong-gold" />
            <div className="text-center">
              <p className="text-anong-gold text-sm font-medium mb-1">{t.location.split(',')[0]}</p>
              <p className="text-anong-cream/80 font-serif text-xs">{t.location.split(',').slice(1).join(',')}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-anong-cream/5 backdrop-blur-sm border border-anong-gold/10">
            <Clock className="h-6 w-6 text-anong-gold" />
            <div className="text-center">
              <p className="text-anong-gold text-sm font-medium mb-1">{t.hours.split(' ').slice(0, 2).join(' ')}</p>
              <p className="text-anong-cream/80 font-serif text-xs">{t.hours.split(' ').slice(2).join(' ')}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-anong-cream/5 backdrop-blur-sm border border-anong-gold/10">
            <Phone className="h-6 w-6 text-anong-gold" />
            <div className="text-center">
              <p className="text-anong-gold text-sm font-medium mb-1">{t.contact}</p>
              <p className="text-anong-cream/80 font-serif text-xs">076 505 9941</p>
            </div>
          </div>
        </motion.div>
        
        {/* Premium botanical divider */}
        <motion.div 
          className="flex items-center justify-center mb-12 md:mb-16"
          variants={itemVariants}
        >
          <div className="w-20 md:w-32 h-px bg-anong-gold/60"></div>
          <div className="mx-8 md:mx-12 botanical-accent w-8 h-8 opacity-90"></div>
          <div className="w-20 md:w-32 h-px bg-anong-gold/60"></div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Link to="/menu">
            <Button 
              className="btn-gold text-base md:text-lg px-12 md:px-16 py-5 md:py-6 h-auto shadow-2xl hover:shadow-3xl border-2 border-anong-gold/20 font-medium tracking-wide relative overflow-hidden group"
              size="lg"
            >
              <span className="relative z-10 flex items-center">
                {t.button}
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RestaurantBanner;
