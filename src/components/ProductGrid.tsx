
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
      title: "Our Premium Products",
      subtitle: "Discover authentic Thai flavors crafted with traditional recipes",
      search: "Search products...",
      all: "All Products",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      noProducts: "No products found matching your criteria."
    },
    th: {
      title: "สินค้าพรีเมียมของเรา",
      subtitle: "ค้นพบรสชาติไทยแท้ที่สร้างด้วยสูตรดั้งเดิม",
      search: "ค้นหาสินค้า...",
      all: "สินค้าทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      noProducts: "ไม่พบสินค้าที่ตรงกับเงื่อนไขของคุณ"
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

  console.log("Available products:", products);
  console.log("Filtered products:", filteredProducts);

  return (
    <section className="py-20 md:py-28 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading-premium text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-dark-green">{t.title}</h1>
          <p className="text-luxury text-lg md:text-xl text-anong-charcoal/80 max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent mx-auto mt-8"></div>
        </motion.div>
        
        {/* Search and Filter */}
        <motion.div 
          className="mb-16 md:mb-20 flex flex-col md:flex-row gap-6 luxury-card p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
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
