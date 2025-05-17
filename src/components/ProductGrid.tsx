
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const ProductGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Our Products",
      search: "Search products...",
      all: "All Products",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      filterButton: "Filter",
      noProducts: "No products found matching your criteria.",
      clearSearch: "Clear"
    },
    th: {
      title: "สินค้าของเรา",
      search: "ค้นหาสินค้า...",
      all: "สินค้าทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      filterButton: "กรอง",
      noProducts: "ไม่พบสินค้าที่ตรงกับเงื่อนไขของคุณ",
      clearSearch: "ล้าง"
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
    // Get category from URL parameters
    const category = searchParams.get('category');
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter products based on category and search term
    let results = [...products];
    
    if (activeCategory !== 'all') {
      results = results.filter(product => product.category === activeCategory);
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(product => 
        product.name[language].toLowerCase().includes(searchLower) ||
        product.shortDescription[language].toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProducts(results);
  }, [activeCategory, searchTerm, language]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Update URL query parameters
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };

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

  console.log("Available products:", products);
  console.log("Filtered products:", filteredProducts);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-[#F5EBFF] subtle-pattern">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-semibold mb-2 text-gray-800 font-display">{t.title}</h2>
          <div className="w-24 h-1 bg-thai-purple mx-auto mt-4 mb-6"></div>
        </motion.div>
        
        {/* Search and Filter */}
        <motion.div 
          className="mb-12 flex flex-col md:flex-row gap-4 bg-white p-6 rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t.search}
              className="pl-10 border-gray-200 focus:border-thai-purple premium-input"
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex-shrink-0 flex flex-wrap gap-2 md:flex-nowrap justify-start">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
                className={
                  activeCategory === category.id
                    ? "bg-thai-purple hover:bg-thai-purple-dark"
                    : "border-thai-purple text-thai-purple hover:bg-thai-purple/10"
                }
              >
                {category.name[language]}
              </Button>
            ))}
          </div>
        </motion.div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-sm">
            {t.noProducts}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
