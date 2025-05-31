
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
      title: "Handcrafted Excellence",
      subtitle: "Our flagship curry pastes, perfected through generations of culinary mastery",
      viewCollection: "View Full Collection",
      discoverMore: "Discover the complete range of authentic Thai flavors"
    },
    th: {
      tagline: "คอลเลกชันเซ็กเนเจอร์",
      title: "ความเป็นเลิศจากฝีมือ",
      subtitle: "พริกแกงเรือธงของเรา ที่ผ่านการปรับปรุงมาหลายชั่วอายุคน",
      viewCollection: "ดูคอลเลกชันทั้งหมด",
      discoverMore: "ค้นพบรสชาติไทยแท้ครบครัน"
    }
  };

  const t = translations[language];

  // Select only flagship products (first 4 premium products)
  const flagshipProducts = products.slice(0, 4);
  
  // Refined animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
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
      transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <section className="section-premium bg-anong-cream watercolor-bg py-32">
      <div className="container mx-auto relative z-10 max-w-7xl">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          {/* Premium tagline */}
          <div className="mb-6">
            <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.4em] uppercase font-light">
              {t.tagline}
            </span>
            <div className="w-24 h-px bg-anong-gold mx-auto mt-3"></div>
          </div>

          <h2 className="heading-premium text-4xl md:text-6xl lg:text-7xl mb-8 text-anong-deep-black font-light tracking-tight">
            {t.title}
          </h2>
          <p className="text-luxury text-xl md:text-2xl max-w-4xl mx-auto text-anong-charcoal/75 font-light leading-relaxed">
            {t.subtitle}
          </p>
          
          {/* Elegant botanical divider */}
          <div className="flex items-center justify-center mt-12">
            <div className="w-16 h-px bg-anong-gold/60"></div>
            <div className="mx-6 botanical-accent w-8 h-8 opacity-60"></div>
            <div className="w-16 h-px bg-anong-gold/60"></div>
          </div>
        </motion.div>
        
        {/* Flagship Products Grid - Premium 2x2 layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-20 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {flagshipProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="hover-lift">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Refined CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <p className="text-luxury text-lg md:text-xl text-anong-charcoal/70 mb-10 max-w-2xl mx-auto">
            {t.discoverMore}
          </p>
          <Button 
            asChild
            size="lg"
            className="btn-outline-premium text-lg px-12 py-6 h-auto font-medium tracking-wide hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-500"
          >
            <Link to="/shop" className="flex items-center">
              {t.viewCollection}
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
