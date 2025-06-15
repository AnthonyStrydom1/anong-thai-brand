
import React from 'react';
import ProductCard from './ProductCard';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const FeaturedProducts = () => {
  const { products, isLoading, error } = useSupabaseProducts();
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Featured Products',
      subtitle: 'Discover our most popular authentic Thai ingredients',
      errorMessage: 'Unable to load products. Please try again later.',
      noProducts: 'No featured products available at the moment.'
    },
    th: {
      title: 'สินค้าแนะนำ',
      subtitle: 'ค้นพบส่วนผสมไทยแท้ที่ได้รับความนิยมมากที่สุดของเรา',
      errorMessage: 'ไม่สามารถโหลดสินค้าได้ กรุณาลองใหม่อีกครั้ง',
      noProducts: 'ไม่มีสินค้าแนะนำในขณะนี้'
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">{t.title}</h2>
          <p className="text-gray-600 text-center mb-12">{t.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">{t.title}</h2>
          <p className="text-red-600 text-center mb-12">{t.errorMessage}</p>
        </div>
      </section>
    );
  }

  // Filter featured products
  const featuredProducts = products.filter(product => product.is_featured);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">{t.title}</h2>
        <p className="text-gray-600 text-center mb-12">{t.subtitle}</p>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                priority={index < 3} // Mark first 3 products as priority
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">{t.noProducts}</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
