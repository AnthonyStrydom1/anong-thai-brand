
import { useState } from 'react';
import { products } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import CategoryFilter from './product/CategoryFilter';
import ProductBanner from './product/ProductBanner';
import FeaturedProductCarousel from './product/FeaturedProductCarousel';
import ViewAllButton from './product/ViewAllButton';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: "Featured Products",
      subtitle: "Discover Anong's premium Thai sauces and curry pastes",
      all: "All",
      curryPastes: "Curry Pastes",
      stirFrySauces: "Stir-Fry Sauces",
      dippingSauces: "Dipping Sauces",
      viewAll: "View All Products",
      exploreProducts: "Explore Our Best Sellers",
      addToCart: "Add to Cart",
      addedToCart: "Added to cart!"
    },
    th: {
      title: "สินค้าแนะนำ",
      subtitle: "ค้นพบซอสและพริกแกงไทยระดับพรีเมียมของอนงค์",
      all: "ทั้งหมด",
      curryPastes: "พริกแกง",
      stirFrySauces: "ซอสผัด",
      dippingSauces: "น้ำจิ้ม",
      viewAll: "ดูสินค้าทั้งหมด",
      exploreProducts: "สำรวจสินค้าขายดีของเรา",
      addToCart: "เพิ่มลงตะกร้า",
      addedToCart: "เพิ่มลงตะกร้าแล้ว!"
    }
  };

  const t = translations[language];

  const filteredProducts = activeCategory === 'all'
    ? products.slice(0, 6)
    : products.filter(p => p.category === activeCategory).slice(0, 6);
  
  const categories = [
    { id: 'all', name: { en: t.all, th: t.all } },
    { id: 'curry-pastes', name: { en: t.curryPastes, th: t.curryPastes } },
    { id: 'stir-fry-sauces', name: { en: t.stirFrySauces, th: t.stirFrySauces } },
    { id: 'dipping-sauces', name: { en: t.dippingSauces, th: t.dippingSauces } }
  ];

  const bannerDescription = language === 'en'
    ? "Quality ingredients, authentic flavors, made with passion. Elevate your cooking with our premium Thai products."
    : "วัตถุดิบคุณภาพ รสชาติแท้ ผลิตด้วยใจ ยกระดับการทำอาหารด้วยผลิตภัณฑ์ไทยระดับพรีเมียม";

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#FCFAFF] to-[#F5EBFF]">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        
        {/* Banner with background */}
        <ProductBanner 
          title={t.exploreProducts} 
          description={bannerDescription} 
        />
        
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory}
          language={language}
          onCategoryChange={setActiveCategory}
        />
        
        {/* Products Carousel */}
        <FeaturedProductCarousel 
          products={filteredProducts}
          language={language}
          translations={{
            addToCart: t.addToCart,
            addedToCart: t.addedToCart
          }}
        />
        
        {/* View All Button */}
        <ViewAllButton text={t.viewAll} />
      </div>
    </section>
  );
};

export default FeaturedProducts;
