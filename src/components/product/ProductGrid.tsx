
import React from 'react';
import ProductCard from '../ProductCard';
import { useSupabaseProducts } from '@/hooks/useSupabaseProducts';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  categoryId?: string;
  searchTerm?: string;
}

const ProductGrid = ({ categoryId, searchTerm }: ProductGridProps) => {
  const { products, isLoading, error } = useSupabaseProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Unable to load products. Please try again later.</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Filter products by search term and category if provided
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.short_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryId || product.category_id === categoryId;
    
    return matchesSearch && matchesCategory;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {searchTerm ? `No products found for "${searchTerm}"` : 'No products available in this category.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
