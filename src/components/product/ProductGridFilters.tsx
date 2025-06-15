
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface Category {
  id: string;
  label: string;
}

interface ProductGridFiltersProps {
  searchTerm: string;
  activeCategory: string;
  categories: Category[];
  searchPlaceholder: string;
  filterByText: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

const ProductGridFilters: React.FC<ProductGridFiltersProps> = ({
  searchTerm,
  activeCategory,
  categories,
  searchPlaceholder,
  filterByText,
  onSearchChange,
  onCategoryChange
}) => {
  return (
    <motion.div 
      className="mb-12 md:mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="anong-card p-6 md:p-8 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-anong-gold h-5 w-5" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 anong-input border-anong-gold/30 focus:border-anong-gold text-lg"
            />
          </div>
          <div className="flex items-center gap-2 text-anong-deep-green">
            <Filter className="h-5 w-5" />
            <span className="font-medium hidden md:inline">{filterByText}</span>
          </div>
        </div>
        
        {/* Enhanced Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="default"
              onClick={() => onCategoryChange(category.id)}
              className={activeCategory === category.id ? 
                "bg-gradient-to-r from-anong-gold to-anong-warm-yellow text-anong-black hover:from-anong-warm-yellow hover:to-anong-gold font-medium shadow-md hover:shadow-lg transition-all duration-300" : 
                "text-anong-deep-green hover:bg-anong-gold/10 border-anong-gold/30 hover:border-anong-gold transition-all duration-300 hover:shadow-md"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductGridFilters;
