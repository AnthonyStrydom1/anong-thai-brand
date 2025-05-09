
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '@/data/products';
import ProductCard from './ProductCard';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  currentLanguage: 'en' | 'th';
}

const FeaturedProducts = ({ currentLanguage }: FeaturedProductsProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const translations = {
    en: {
      title: "Featured Products",
      subtitle: "Discover Anong's premium Thai sauces and curry pastes",
      all: "All",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      viewAll: "View All Products"
    },
    th: {
      title: "สินค้าแนะนำ",
      subtitle: "ค้นพบซอสและพริกแกงไทยระดับพรีเมียมของอนงค์",
      all: "ทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      viewAll: "ดูสินค้าทั้งหมด"
    }
  };

  const t = translations[currentLanguage];

  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 3)
    : products.filter(p => p.category === activeCategory).slice(0, 3);
  
  const categories = [
    { id: 'all', name: { en: t.all, th: t.all } },
    { id: 'curry-pastes', name: { en: t.curryPastes, th: t.curryPastes } },
    { id: 'stir-fry-sauces', name: { en: t.stirFrySauces, th: t.stirFrySauces } },
    { id: 'dipping-sauces', name: { en: t.dippingSauces, th: t.dippingSauces } }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-thai-purple hover:bg-thai-purple-dark"
                  : "border-thai-purple text-thai-purple hover:bg-thai-purple/10"
              }
            >
              {category.name[currentLanguage]}
            </Button>
          ))}
        </div>
        
        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currentLanguage={currentLanguage}
            />
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center">
          <Button 
            asChild
            variant="outline" 
            className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
          >
            <Link to="/shop">
              {t.viewAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
