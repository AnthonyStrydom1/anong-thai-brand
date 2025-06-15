
import React from 'react';
import { motion } from 'framer-motion';

interface ProductGridHeaderProps {
  title: string;
  subtitle: string;
  craftedWith: string;
}

const ProductGridHeader: React.FC<ProductGridHeaderProps> = ({ 
  title, 
  subtitle, 
  craftedWith 
}) => {
  return (
    <motion.div 
      className="text-center mb-16 md:mb-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ANONG Logo with enhanced styling */}
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 anong-hover-lift">
          <div className="w-full h-full bg-gradient-to-br from-anong-gold to-anong-warm-yellow rounded-full p-1 shadow-lg">
            <div className="w-full h-full bg-anong-ivory rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                alt="ANONG Logo"
                className="w-3/4 h-3/4 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      
      <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black bg-gradient-to-r from-anong-black via-anong-deep-green to-anong-black bg-clip-text">{title}</h1>
      <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed mb-8">{subtitle}</p>
      
      {/* Enhanced Thai Lotus Divider */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
        <div className="mx-8 thai-lotus-divider w-12 h-12 bg-gradient-to-br from-anong-gold to-anong-warm-yellow rounded-full p-2 shadow-lg">
          <div className="w-full h-full bg-anong-ivory rounded-full flex items-center justify-center">
            <div className="w-6 h-6 thai-lotus-divider"></div>
          </div>
        </div>
        <div className="w-32 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
      </div>
      
      <p className="anong-body-light text-sm tracking-wide text-anong-gold font-medium">
        {craftedWith}
      </p>
    </motion.div>
  );
};

export default ProductGridHeader;
