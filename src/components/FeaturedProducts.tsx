
import { useState } from 'react';
import { products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryFilter from './product/CategoryFilter';
import ProductCard from './ProductCard';
import ViewAllButton from './product/ViewAllButton';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Premium Collection",
      subtitle: "Discover handcrafted Thai curry pastes rooted in tradition",
      tagline: "FEATURED PRODUCTS",
      all: "All",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      viewAll: "View Full Collection",
      exploreProducts: "Explore Our Best Sellers",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart!"
    },
    th: {
      title: "คอลเลกชันพรีเมียม",
      subtitle: "ค้นพบพริกแกงไทยที่สร้างสรรค์ด้วยมือ รากฐานจากประเพณี",
      tagline: "สินค้าแนะนำ",
      all: "ทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      viewAll: "ดูคอลเลกชันทั้งหมด",
      exploreProducts: "สำรวจสินค้าขายดีของเรา",
      addToCart: "เพิ่มลงตะกร้า",
      addedToCart: "เพิ่มลงตะกร้าแล้ว!"
    }
  };

  const t = translations[language];

  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 6)
    : products.filter(p => p.category === activeCategory).slice(0, 6);
  
  const categories = [
    { id: 'all', name: { en: t.all, th: t.all } },
    { id: 'curry-pastes', name: { en: t.curryPastes, th: t.curryPastes } },
    { id: 'stir-fry-sauces', name: { en: t.stirFrySauces, th: t.stirFrySauces } },
    { id: 'dipping-sauces', name: { en: t.dippingSauces, th: t.dippingSauces } }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="section-premium bg-anong-cream watercolor-bg">
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Premium tagline */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-elegant text-anong-gold text-sm md:text-base tracking-[0.3em] uppercase">
              {t.tagline}
            </span>
            <div className="w-16 h-px bg-anong-gold mx-auto mt-2"></div>
          </motion.div>

          <h2 className="heading-premium text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-deep-black">
            {t.title}
          </h2>
          <p className="text-luxury text-lg md:text-xl max-w-3xl mx-auto text-anong-charcoal/80">
            {t.subtitle}
          </p>
          
          {/* Botanical divider */}
          <div className="flex items-center justify-center mt-8 mb-4">
            <div className="w-8 h-px bg-anong-gold"></div>
            <div className="mx-4 botanical-accent w-6 h-6"></div>
            <div className="w-8 h-px bg-anong-gold"></div>
          </div>
        </motion.div>
        
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="my-12"
        >
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory}
            language={language}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>
        
        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants} className="hover-lift">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <ViewAllButton text={t.viewAll} />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
