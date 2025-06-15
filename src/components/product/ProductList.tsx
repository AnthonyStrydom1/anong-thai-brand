
import React from 'react';
import { motion } from 'framer-motion';
import { SupabaseProduct } from '@/services/supabaseService';
import ProductCard from '../ProductCard';

interface ProductListProps {
  products: SupabaseProduct[];
  noProductsMessage: string;
}

const ProductList: React.FC<ProductListProps> = ({ products, noProductsMessage }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="anong-card max-w-lg mx-auto p-12 shadow-lg">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-anong-gold/20 to-anong-warm-yellow/20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-anong-gold/30 rounded-full"></div>
          </div>
          <p className="anong-body text-xl text-anong-charcoal/70 mb-4">{noProductsMessage}</p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <motion.div 
          key={product.id} 
          variants={itemVariants}
          className="anong-hover-lift"
        >
          <ProductCard 
            product={product} 
            priority={index < 6} // Mark first 6 products as priority for better loading
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductList;
