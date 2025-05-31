
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import { motion } from "framer-motion";

const Index = () => {
  const { language } = useLanguage();
  
  // Premium animation variants with sophisticated timing
  const sectionVariants = {
    offscreen: {
      y: 30,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
        type: "spring",
        damping: 20
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <Header />
      
      <main className="flex-grow">
        <HeroBanner />
        
        <div className="relative content-spacing-lg">
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
            className="section-premium"
          >
            <FeaturedProducts />
          </motion.div>
          
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={sectionVariants}
            className="section-premium"
          >
            <BrandStory />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
