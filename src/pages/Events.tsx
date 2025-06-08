
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Events = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const translations = {
    en: {
      title: "Events & Workshops",
      subtitle: "Join us for exclusive Thai cooking experiences and cultural celebrations",
      comingSoon: "Coming Soon",
      description: "We're preparing exciting events and workshops for you. Stay tuned for updates!"
    },
    th: {
      title: "งานและเวิร์คช็อป",
      subtitle: "เข้าร่วมกับเราในประสบการณ์การทำอาหารไทยและการเฉลิมฉลองทางวัฒนธรรม",
      comingSoon: "เร็วๆ นี้",
      description: "เรากำลังเตรียมงานและเวิร์คช็อปที่น่าตื่นเต้นสำหรับคุณ ติดตามข้อมูลอัปเดต!"
    }
  };

  const t = translations[language];
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-16 md:mb-20"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="w-16 h-16 mx-auto mb-6">
              <img 
                src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                alt="ANONG Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black">{t.title}</h1>
            <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>
            
            {/* Thai Lotus Divider */}
            <div className="flex items-center justify-center mt-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
              <div className="mx-8 thai-lotus-divider w-8 h-8"></div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
            </div>
          </motion.div>
          
          {/* Coming Soon Section */}
          <motion.div 
            className="anong-card p-12 md:p-16 text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h2 className="anong-subheading text-3xl md:text-4xl mb-8 text-anong-black">{t.comingSoon}</h2>
            <p className="anong-body text-lg text-anong-black/80 max-w-2xl mx-auto leading-relaxed">{t.description}</p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
