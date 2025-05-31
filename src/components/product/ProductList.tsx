
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import ProductCard from '../ProductCard';

interface ProductListProps {
  products: Product[];
  noProductsMessage: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, noProductsMessage }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-anong-charcoal/60 luxury-card">
        <p className="text-luxury text-lg">{noProductsMessage}</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductList;
