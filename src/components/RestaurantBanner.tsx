
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

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
  
  return (
    <section className="relative overflow-hidden my-12 rounded-xl shadow-xl">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          filter: "brightness(0.6)"
        }}
      ></div>
      
      {/* Purple overlay with enhanced opacity and gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3b0b5a] via-[#520F7A] to-[#6a1f97] opacity-90"></div>
      
      {/* Content with improved typography and spacing */}
      <div className="relative container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-display tracking-tight leading-tight">{t.title}</h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 font-light">{t.subtitle}</p>
        <p className="text-white/80 mb-3 font-light text-lg">20 Hettie Street, Cyrildene, Johannesburg, 2198</p>
        <p className="text-white/80 mb-10 font-light">
          Anong: 076 505 9941 | Howard: 074 240 6712 | Justin: 072 102 0284
        </p>
        <Link to="/menu">
          <Button 
            className="bg-white text-[#520F7A] hover:bg-white/90 hover:text-[#520F7A] text-lg px-10 py-7 h-auto rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            size="lg"
          >
            {t.button}
            <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default RestaurantBanner;
