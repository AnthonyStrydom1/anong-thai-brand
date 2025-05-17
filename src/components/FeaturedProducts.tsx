
import { useState } from 'react';
import { products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryFilter from './product/CategoryFilter';
import ProductBanner from './product/ProductBanner';
import ProductCard from './ProductCard';
import ViewAllButton from './product/ViewAllButton';
import { motion } from 'framer-motion';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Featured Products",
      subtitle: "Discover Anong's premium Thai sauces and curry pastes",
      all: "All",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      viewAll: "View All Products",
      exploreProducts: "Explore Our Best Sellers",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart!"
    },
    th: {
      title: "สินค้าแนะนำ",
      subtitle: "ค้นพบซอสและพริกแกงไทยระดับพรีเมียมของอนงค์",
      all: "ทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      viewAll: "ดูสินค้าทั้งหมด",
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

  const bannerDescription = language === 'en'
    ? "Quality ingredients, authentic flavors, made with passion. Elevate your cooking with our premium Thai products."
    : "วัตถุดิบคุณภาพ รสชาติแท้ ผลิตด้วยใจ ยกระดับการทำอาหารด้วยผลิตภัณฑ์ไทยระดับพรีเมียม";

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
    <section className="py-16 px-4 bg-gradient-to-b from-[#FCFAFF] to-[#F5EBFF] thai-lotus-bg">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-semibold mb-3 text-gray-800 font-display">{t.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
          <div className="w-24 h-1 bg-thai-purple mx-auto mt-5"></div>
        </motion.div>
        
        {/* Banner with background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProductBanner 
            title={t.exploreProducts} 
            description={bannerDescription} 
          />
        </motion.div>
        
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="my-10"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
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
        >
          <ViewAllButton text={t.viewAll} />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
