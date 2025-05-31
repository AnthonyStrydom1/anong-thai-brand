
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

  // Select only 3 curated flagship products for maximum exclusivity
  const flagshipProducts = products.slice(0, 3);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="bg-anong-cream py-24 md:py-32 lg:py-36 relative overflow-hidden">
      {/* Refined botanical background texture */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0 bg-botanical-pattern"></div>
      </div>
      
      <div className="container mx-auto relative z-10 max-w-6xl px-4">
        <motion.div 
          className="text-center mb-20 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={headerVariants}
        >
          <div className="mb-8 md:mb-10">
            <span className="font-elegant text-anong-gold text-xs md:text-sm tracking-[0.3em] uppercase font-light">
              {t.tagline}
            </span>
            <div className="w-24 md:w-32 h-px bg-anong-gold mx-auto mt-4 md:mt-5"></div>
          </div>

          <h2 className="heading-premium text-4xl md:text-5xl lg:text-6xl mb-8 md:mb-10 text-anong-deep-black font-light tracking-tight">
            {t.title}
          </h2>
          <p className="text-luxury text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-anong-charcoal/70 font-light leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Curated Product Grid - Blue Elephant inspired layout with 3 products */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20 mb-20 md:mb-24"
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
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center justify-center mb-16 md:mb-20"
        >
          <div className="w-32 md:w-40 h-px bg-anong-gold/50"></div>
          <div className="mx-10 md:mx-12 botanical-accent w-8 md:w-10 h-8 md:h-10 opacity-70"></div>
          <div className="w-32 md:w-40 h-px bg-anong-gold/50"></div>
        </motion.div>
        
        {/* Premium CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <Button 
            asChild
            size="lg"
            className="btn-outline-premium text-base md:text-lg px-12 md:px-16 py-5 md:py-6 h-auto font-medium tracking-wide hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-500 shadow-lg hover:shadow-xl"
          >
            <Link to="/shop" className="flex items-center">
              {t.viewCollection}
              <ArrowRight className="ml-4 h-5 w-5 md:h-6 md:w-6" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
