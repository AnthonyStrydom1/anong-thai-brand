
import React from 'react';
import ProductCard from './ProductCard';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProducts = () => {
  const { products, isLoading, error } = useSupabaseProducts();

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Featured Products</h2>
          <p className="text-gray-600 text-center mb-12">Discover our most popular authentic Thai ingredients</p>
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
          <h2 className="text-3xl font-bold text-center mb-2">Featured Products</h2>
          <p className="text-red-600 text-center mb-12">Unable to load products. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Filter featured products
  const featuredProducts = products.filter(product => product.is_featured);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Featured Products</h2>
        <p className="text-gray-600 text-center mb-12">Discover our most popular authentic Thai ingredients</p>
        
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
          <p className="text-gray-600 text-center">No featured products available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
