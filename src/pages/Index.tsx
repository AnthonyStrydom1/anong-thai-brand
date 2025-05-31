
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import ContactInfo from "@/components/ContactInfo";
import RestaurantBanner from "@/components/RestaurantBanner";
import { motion } from "framer-motion";

const Index = () => {
  const { language } = useLanguage();
  
  // Refined animation variants for smoother, more luxurious transitions
  const sectionVariants = {
    offscreen: {
      y: 25,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <Header />
      
      <main className="flex-grow">
        <HeroBanner />
        
        <div className="relative">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.08 }}
            variants={sectionVariants}
          >
            <FeaturedProducts />
          </motion.div>
          
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.08 }}
            variants={sectionVariants}
          >
            <BrandStory />
          </motion.div>
          
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.08 }}
            variants={sectionVariants}
          >
            <RestaurantBanner />
          </motion.div>
          
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.08 }}
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
