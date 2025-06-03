
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
        staggerChildren: 0.2,
        delayChildren: 0.4
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
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="relative py-28 md:py-36 lg:py-40 overflow-hidden">
      {/* Enhanced background with subtle botanical texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-anong-cream via-anong-warm-cream/30 to-anong-cream">
        <div className="absolute inset-0 bg-botanical-pattern opacity-[0.018]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-anong-gold/[0.008] via-transparent to-anong-gold/[0.008]"></div>
      </div>
      
      <div className="container mx-auto relative z-10 max-w-7xl px-6 md:px-8">
        <motion.div 
          className="text-center mb-24 md:mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={headerVariants}
        >
          <div className="mb-10 md:mb-12">
            <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.35em] uppercase font-light">
              {t.tagline}
            </span>
            <div className="w-32 md:w-40 h-px bg-gradient-to-r from-transparent via-anong-gold/80 to-transparent mx-auto mt-6"></div>
          </div>

          <h2 className="heading-premium text-5xl md:text-6xl lg:text-7xl mb-10 md:mb-12 text-anong-deep-black font-light tracking-tight">
            {t.title}
          </h2>
          <p className="text-luxury text-xl md:text-2xl lg:text-2xl max-w-4xl mx-auto text-anong-charcoal/75 font-light leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Enhanced Product Grid with premium spacing */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20 lg:gap-24 mb-24 md:mb-28"
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
        
        {/* Enhanced botanical divider with gold gradient */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center justify-center mb-20 md:mb-24"
        >
          <div className="w-40 md:w-52 h-px bg-gradient-to-r from-transparent via-anong-gold/70 to-anong-gold/40"></div>
          <div className="mx-12 md:mx-16 botanical-accent w-10 md:w-12 h-10 md:h-12 opacity-80 drop-shadow-sm"></div>
          <div className="w-40 md:w-52 h-px bg-gradient-to-l from-transparent via-anong-gold/70 to-anong-gold/40"></div>
        </motion.div>
        
        {/* Premium CTA Section with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <Button 
            asChild
            size="lg"
            className="bg-anong-black hover:bg-anong-gold hover:text-anong-black text-anong-ivory text-lg md:text-xl px-16 md:px-20 py-6 md:py-7 h-auto font-medium tracking-wide transition-all duration-600 shadow-xl hover:shadow-2xl border-2 border-anong-black/10 rounded-2xl group"
          >
            <Link to="/shop" className="flex items-center">
              {t.viewCollection}
              <ArrowRight className="ml-5 h-6 w-6 md:h-7 md:w-7 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
