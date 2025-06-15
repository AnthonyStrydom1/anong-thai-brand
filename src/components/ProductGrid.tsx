
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import ProductList from './product/ProductList';
import ProductGridHeader from './product/ProductGridHeader';
import ProductGridFilters from './product/ProductGridFilters';
import ProductGridLoading from './product/ProductGridLoading';
import ProductGridError from './product/ProductGridError';
import NavigationBanner from './NavigationBanner';

interface ProductGridProps {
  initialCategory?: string | null;
}

const ProductGrid = ({ initialCategory }: ProductGridProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const { products, isLoading, error } = useSupabaseProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  
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
      craftedWith: "Crafted with tradition, delivered with love",
      loading: "Loading products...",
      errorTitle: "Unable to load products. Please try again later.",
      filterBy: "Filter by category"
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
      craftedWith: "สร้างด้วยประเพณี ส่งมอบด้วยความรัก",
      loading: "กำลังโหลดสินค้า...",
      errorTitle: "ไม่สามารถโหลดสินค้าได้ กรุณาลองใหม่อีกครั้ง",
      filterBy: "กรองตามหมวดหมู่"
    }
  };

  const t = translations[language];

  // Update category when URL parameter changes
  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory, activeCategory]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // For now, show all products since we need to map category_id to category names
    // This will be improved once we have proper category mapping
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'curry-pastes' && (
        product.name.toLowerCase().includes('curry') || 
        product.name.toLowerCase().includes('paste')
      )) ||
      (activeCategory === 'stir-fry-sauces' && (
        product.name.toLowerCase().includes('pad thai') ||
        product.name.toLowerCase().includes('stir')
      )) ||
      (activeCategory === 'dipping-sauces' && (
        product.name.toLowerCase().includes('sukiyaki') ||
        product.name.toLowerCase().includes('dipping')
      ));
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: t.all },
    { id: 'curry-pastes', label: t.curryPastes },
    { id: 'stir-fry-sauces', label: t.stirFrySauces },
    { id: 'dipping-sauces', label: t.dippingSauces }
  ];

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams, { replace: true });
  };

  if (isLoading) {
    return <ProductGridLoading loadingText={t.loading} />;
  }

  if (error) {
    return <ProductGridError errorTitle={t.errorTitle} error={error} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-anong-ivory via-anong-cream to-anong-ivory">
      <NavigationBanner />
      <section className="px-4 md:px-6 py-8 md:py-12 thai-pattern-bg relative">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-anong-gold/5 via-transparent to-anong-deep-green/5 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <ProductGridHeader
            title={t.title}
            subtitle={t.subtitle}
            craftedWith={t.craftedWith}
          />
          
          <ProductGridFilters
            searchTerm={searchTerm}
            activeCategory={activeCategory}
            categories={categories}
            searchPlaceholder={t.search}
            filterByText={t.filterBy}
            onSearchChange={setSearchTerm}
            onCategoryChange={handleCategoryChange}
          />
          
          {/* Enhanced Products List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ProductList
              products={filteredProducts}
              noProductsMessage={t.noProducts}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProductGrid;
