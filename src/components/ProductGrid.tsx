
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const ProductGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Our Products",
      subtitle: "Traditional Thai flavors, crafted with care",
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
      subtitle: "รสชาติไทยแท้ ปรุงอย่างพิถีพิถัน",
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

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3 text-gray-800 font-display">{t.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t.search}
              className="pl-10 border-gray-300 focus:border-thai-purple focus:ring focus:ring-thai-purple/20 transition-all"
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
          
          <div className="flex-shrink-0 flex flex-wrap gap-2 md:flex-nowrap justify-center md:justify-start">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
                className={
                  activeCategory === category.id
                    ? "bg-thai-purple hover:bg-thai-purple-dark transition-colors"
                    : "border-thai-purple text-thai-purple hover:bg-thai-purple/10 transition-colors"
                }
              >
                {category.name[language]}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            {t.noProducts}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
