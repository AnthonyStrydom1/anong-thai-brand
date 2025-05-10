
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product } from '@/types';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
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
      search: "Search products...",
      all: "All Products",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      filterButton: "Filter",
      noProducts: "No products found matching your criteria."
    },
    th: {
      title: "สินค้าของเรา",
      search: "ค้นหาสินค้า...",
      all: "สินค้าทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      filterButton: "กรอง",
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

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">{t.title}</h2>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={t.search}
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
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
        </div>
        
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {t.noProducts}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
