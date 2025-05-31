
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

  // Select only 3 flagship products for refined showcase
  const flagshipProducts = products.slice(0, 3);
  
  // Soft, elegant animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="section-premium bg-anong-cream watercolor-bg py-28 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-botanical-pattern opacity-8"></div>
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={headerVariants}
        >
          {/* Refined tagline */}
          <div className="mb-8">
            <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.4em] uppercase font-light">
              {t.tagline}
            </span>
            <div className="w-20 h-px bg-anong-gold mx-auto mt-4"></div>
          </div>

          <h2 className="heading-premium text-4xl md:text-5xl lg:text-6xl mb-8 text-anong-deep-black font-light tracking-tight">
            {t.title}
          </h2>
          <p className="text-luxury text-lg md:text-xl max-w-3xl mx-auto text-anong-charcoal/75 font-light leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Flagship Products Grid - Clean 3-column layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {flagshipProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="hover-lift">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Elegant botanical divider */}
        <motion.div 
          className="flex items-center justify-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-20 h-px bg-anong-gold/50"></div>
          <div className="mx-8 botanical-accent w-6 h-6 opacity-60"></div>
          <div className="w-20 h-px bg-anong-gold/50"></div>
        </motion.div>
        
        {/* Refined CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <Button 
            asChild
            size="lg"
            className="btn-outline-premium text-base px-10 py-5 h-auto font-medium tracking-wide hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-500"
          >
            <Link to="/shop" className="flex items-center">
              {t.viewCollection}
              <ArrowRight className="ml-3 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
