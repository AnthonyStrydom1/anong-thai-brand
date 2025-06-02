
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
        staggerChildren: 0.3 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };
  
  return (
    <section className="relative overflow-hidden my-16 md:my-20 rounded-3xl shadow-xl mx-6 md:mx-8">
      {/* Simplified background with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-anong-black to-anong-charcoal">
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Gold decorative border */}
      <div className="absolute inset-0 border-2 border-anong-gold/30 rounded-3xl"></div>
      
      {/* Compact content with better spacing */}
      <motion.div 
        className="relative container mx-auto px-6 md:px-10 py-16 md:py-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Tagline */}
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <span className="font-heading text-anong-gold text-sm md:text-base tracking-[0.3em] uppercase font-light">
            {t.tagline}
          </span>
          <div className="w-16 h-px bg-anong-gold mx-auto mt-3"></div>
        </motion.div>

        <motion.h2 
          className="font-heading text-3xl md:text-4xl lg:text-5xl text-anong-cream mb-6 leading-tight font-light"
          variants={itemVariants}
        >
          {t.title}
        </motion.h2>
        
        <motion.p 
          className="text-base md:text-lg text-anong-cream/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          variants={itemVariants}
        >
          {t.subtitle}
        </motion.p>
        
        {/* Compact contact information */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 max-w-3xl mx-auto" variants={itemVariants}>
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-anong-cream/10 backdrop-blur-sm border border-anong-gold/20">
            <MapPin className="h-5 w-5 text-anong-gold" />
            <div className="text-center">
              <p className="text-anong-gold text-sm font-medium">{t.location.split(',')[0]}</p>
              <p className="text-anong-cream/80 text-xs">{t.location.split(',').slice(1).join(',')}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-anong-cream/10 backdrop-blur-sm border border-anong-gold/20">
            <Clock className="h-5 w-5 text-anong-gold" />
            <div className="text-center">
              <p className="text-anong-gold text-sm font-medium">{t.hours.split(' ').slice(0, 2).join(' ')}</p>
              <p className="text-anong-cream/80 text-xs">{t.hours.split(' ').slice(2).join(' ')}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-anong-cream/10 backdrop-blur-sm border border-anong-gold/20">
            <Phone className="h-5 w-5 text-anong-gold" />
            <div className="text-center">
              <p className="text-anong-gold text-sm font-medium">{t.contact}</p>
              <p className="text-anong-cream/80 text-xs">076 505 9941</p>
            </div>
          </div>
        </motion.div>
        
        {/* Simple divider */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          variants={itemVariants}
        >
          <div className="w-16 h-px bg-anong-gold/60"></div>
          <div className="mx-6 w-2 h-2 bg-anong-gold rounded-full"></div>
          <div className="w-16 h-px bg-anong-gold/60"></div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Link to="/menu">
            <Button 
              className="bg-anong-gold text-anong-black hover:bg-anong-gold/90 text-base md:text-lg px-8 md:px-12 py-4 md:py-5 h-auto shadow-xl hover:shadow-2xl border-2 border-anong-gold/30 font-medium tracking-wide relative overflow-hidden group"
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
