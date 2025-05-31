
import { products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      tagline: "SIGNATURE COLLECTION",
      title: "Our Flagship Selection",
      subtitle: "Handcrafted curry pastes that define authentic Thai cuisine",
      viewCollection: "View Full Collection"
    },
    th: {
      tagline: "คอลเลกชันเซ็กเนเจอร์",
      title: "เซเลคชันเรือธง",
      subtitle: "พริกแกงที่สร้างสรรค์ด้วยมือ กำหนดมาตรฐานอาหารไทยแท้",
      viewCollection: "ดูคอลเลกชันทั้งหมด"
    }
  };

  const t = translations[language];

  // Select only 6 flagship products for a more structured showcase
  const flagshipProducts = products.slice(0, 6);
  
  // Refined animation variants for luxury feel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="bg-anong-cream py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-botanical-pattern opacity-4"></div>
      
      <div className="container mx-auto relative z-10 max-w-7xl px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={headerVariants}
        >
          {/* Premium tagline */}
          <div className="mb-6">
            <span className="font-elegant text-anong-gold text-xs md:text-sm tracking-[0.3em] uppercase font-light">
              {t.tagline}
            </span>
            <div className="w-16 h-px bg-anong-gold mx-auto mt-3"></div>
          </div>

          <h2 className="heading-premium text-3xl md:text-4xl lg:text-5xl mb-6 text-anong-deep-black font-light tracking-tight">
            {t.title}
          </h2>
          <p className="text-luxury text-base md:text-lg max-w-2xl mx-auto text-anong-charcoal/70 font-light leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Structured Product Grid - Clean 3x2 layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
        >
          {flagshipProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} isSimplified={true} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Refined CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <Button 
            asChild
            size="lg"
            className="btn-outline-premium text-sm px-8 py-4 h-auto font-medium tracking-wide hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-500"
          >
            <Link to="/shop" className="flex items-center">
              {t.viewCollection}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
