
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const RestaurantBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Try Our Restaurant",
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
    <section className="relative overflow-hidden my-8">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/686aefa1-f156-42a0-aa07-67b1e5426918.png')",
          filter: "brightness(0.7)"
        }}
      ></div>
      
      {/* Dark red overlay */}
      <div className="absolute inset-0 bg-[#800000] opacity-80"></div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{t.title}</h2>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8">Anong Thai Restaurant</h3>
        <p className="text-lg text-white max-w-2xl mx-auto mb-8">{t.subtitle}</p>
        <p className="text-white mb-2">0 Hettie Street, Cyrildene, Johannesburg, 2198</p>
        <p className="text-white mb-8">
          Anong: 076 505 9941 | Howard: 074 240 6712 | Justin: 072 102 0284
        </p>
        <Link to="/menu">
          <Button 
            className="bg-white text-[#800000] hover:bg-white/90 hover:text-[#800000] text-lg px-8 py-6 h-auto"
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
