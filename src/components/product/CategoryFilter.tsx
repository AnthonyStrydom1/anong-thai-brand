
import React from 'react';
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: {
    en: string;
    th: string;
  };
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  language: 'en' | 'th';
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  language, 
  onCategoryChange 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
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
  );
};

export default CategoryFilter;
