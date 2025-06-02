
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useProductFilters } from '@/hooks/useProductFilters';
import ProductSearch from './product/ProductSearch';
import ProductCategoryFilter from './product/ProductCategoryFilter';
import ProductList from './product/ProductList';

const ProductGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const {
    filteredProducts,
    searchTerm,
    activeCategory,
    handleSearchChange,
    handleClearSearch,
    handleCategoryChange
  } = useProductFilters({
    products,
    initialCategory: searchParams.get('category') || 'all',
    language
  });
  
  const translations = {
    en: {
      title: "Our Premium Collection",
      subtitle: "Discover authentic Thai flavors crafted with traditional recipes and premium ingredients",
      search: "Search our collection...",
      all: "All Products",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      noProducts: "No products found matching your criteria.",
      craftedWith: "Crafted with tradition, delivered with love"
    },
    th: {
      title: "คอลเลคชั่นพรีเมียมของเรา",
      subtitle: "ค้นพบรสชาติไทยแท้ที่สร้างด้วยสูตรดั้งเดิมและวัตถุดิบคุณภาพพรีเมียม",
      search: "ค้นหาในคอลเลคชั่นของเรา...",
      all: "สินค้าทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      noProducts: "ไม่พบสินค้าที่ตรงกับเงื่อนไขของคุณ",
      craftedWith: "สร้างด้วยประเพณี ส่งมอบด้วยความรัก"
    }
  };

  const t = translations[language];
  
  const categories = [
    { id: 'all', name: { en: t.all, th: t.all } },
    { id: 'curry-pastes', name: { en: t.curryPastes, th: t.curryPastes } },
    { id: 'stir-fry-sauces', name: { en: t.stirFrySauces, th: t.stirFrySauces } },
    { id: 'dipping-sauces', name: { en: t.dippingSauces, th: t.dippingSauces } }
  ];

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      handleCategoryChange(category);
    }
  }, [searchParams]);

  const onCategoryChange = (categoryId: string) => {
    handleCategoryChange(categoryId);
    
    // Update URL query parameters
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  return (
    <section className="anong-section px-4 md:px-6 bg-anong-ivory thai-pattern-bg">
      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ANONG Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <img 
                src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                alt="ANONG Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black">{t.title}</h1>
          <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed mb-8">{t.subtitle}</p>
          
          {/* Thai Lotus Divider */}
          <div className="flex items-center justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
            <div className="mx-8 thai-lotus-divider w-8 h-8"></div>
            <div className="w-24 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
          </div>
          
          <p className="anong-body-light text-sm tracking-wide text-anong-gold mt-6 font-medium">
            {t.craftedWith}
          </p>
        </motion.div>
        
        {/* Search and Filter */}
        <motion.div 
          className="mb-16 md:mb-20 anong-card p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <ProductSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onClearSearch={handleClearSearch}
              placeholder={t.search}
            />
            
            <ProductCategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={onCategoryChange}
              language={language}
            />
          </div>
        </motion.div>
        
        {/* Products List */}
        <ProductList
          products={filteredProducts}
          noProductsMessage={t.noProducts}
        />
      </div>
    </section>
  );
};

export default ProductGrid;
