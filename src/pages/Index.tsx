
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutPreview from "@/components/AboutPreview";
import ContactInfo from "@/components/ContactInfo";
import RestaurantBanner from "@/components/RestaurantBanner";
import { motion } from "framer-motion";

const Index = () => {
  const { language } = useLanguage();
  
  // Animation variants for sections
  const sectionVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.2,
        duration: 0.8
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow subtle-pattern">
        <HeroBanner />
        
        <div className="container mx-auto px-4 md:px-0">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
            className="pt-12"
          >
            <FeaturedProducts />
          </motion.div>
          
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
          >
            <AboutPreview />
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
            <ContactInfo />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
