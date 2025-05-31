
import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface UseProductFiltersProps {
  products: Product[];
  initialCategory?: string;
  language: 'en' | 'th';
}

export const useProductFilters = ({ products, initialCategory = 'all', language }: UseProductFiltersProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
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
  }, [activeCategory, searchTerm, language, products]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return {
    filteredProducts,
    searchTerm,
    activeCategory,
    handleSearchChange,
    handleClearSearch,
    handleCategoryChange
  };
};
