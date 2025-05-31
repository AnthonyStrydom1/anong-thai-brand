
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

  // Select only 4 curated flagship products for exclusivity
  const flagshipProducts = products.slice(0, 4);
  
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
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="bg-anong-cream py-20 md:py-24 lg:py-28 relative overflow-hidden">
      {/* Refined botanical background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-botanical-pattern"></div>
      </div>
      
      <div className="container mx-auto relative z-10 max-w-7xl px-4">
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={headerVariants}
        >
          <div className="mb-6 md:mb-8">
            <span className="font-elegant text-anong-gold text-xs md:text-sm tracking-[0.25em] uppercase font-light">
              {t.tagline}
            </span>
            <div className="w-20 md:w-24 h-px bg-anong-gold mx-auto mt-3 md:mt-4"></div>
          </div>

          <h2 className="heading-premium text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 text-anong-deep-black font-light tracking-tight">
            {t.title}
          </h2>
          <p className="text-luxury text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-anong-charcoal/70 font-light leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Curated Product Grid - Blue Elephant inspired layout */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-16 md:mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
        >
          {flagshipProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} isSimplified={true} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Elegant botanical divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center justify-center mb-12 md:mb-16"
        >
          <div className="w-24 md:w-32 h-px bg-anong-gold/40"></div>
          <div className="mx-8 md:mx-10 botanical-accent w-6 md:w-8 h-6 md:h-8 opacity-60"></div>
          <div className="w-24 md:w-32 h-px bg-anong-gold/40"></div>
        </motion.div>
        
        {/* Premium CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <Button 
            asChild
            size="lg"
            className="btn-outline-premium text-sm md:text-base px-8 md:px-10 py-4 md:py-5 h-auto font-medium tracking-wide hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-500 shadow-sm hover:shadow-md"
          >
            <Link to="/shop" className="flex items-center">
              {t.viewCollection}
              <ArrowRight className="ml-3 h-4 w-4 md:h-5 md:w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
