
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import RestaurantBanner from "@/components/RestaurantBanner";
import EventsBanner from "@/components/EventsBanner";
import CurrencySelector from "@/components/CurrencySelector";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Index = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const sectionVariants = {
    offscreen: {
      y: 40,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.4,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        damping: 25
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <Header />
      
      {/* Currency selector header */}
      <div className="bg-anong-cream border-b border-anong-gold/10 py-4">
        <div className="container mx-auto px-6 md:px-8 flex justify-end">
          <CurrencySelector />
        </div>
      </div>
      
      <main className="flex-grow">
        <HeroBanner />
        
        <div className="relative thai-pattern-bg">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <FeaturedProducts />
          </motion.div>
          
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
            className="my-16 md:my-24"
          >
            <BrandStory />
          </motion.div>
          
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <RestaurantBanner />
          </motion.div>

          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <EventsBanner />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
