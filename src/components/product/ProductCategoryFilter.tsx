
import React from 'react';
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: {
    en: string;
    th: string;
  };
}

interface ProductCategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  language: 'en' | 'th';
}

const ProductCategoryFilter: React.FC<ProductCategoryFilterProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  language
}) => {
  return (
    <div className="flex-shrink-0 flex flex-wrap gap-2 md:flex-nowrap justify-start">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={
            activeCategory === category.id
              ? "btn-premium"
              : "btn-outline-premium"
          }
        >
          {category.name[language]}
        </Button>
      ))}
    </div>
  );
};

export default ProductCategoryFilter;
