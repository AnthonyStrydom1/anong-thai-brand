
import React from 'react';

interface ProductBannerProps {
  title: string;
  description: string;
}

const ProductBanner: React.FC<ProductBannerProps> = ({ title, description }) => {
  return (
    <div className="relative mb-14 rounded-xl overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-[#520F7A] via-[#7A2BAA] to-[#9D4EDD] opacity-90"></div>
      <div className="relative py-12 px-8 md:py-16 md:px-12 text-center text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">{title}</h3>
        <p className="mb-6 max-w-2xl mx-auto">{description}</p>
      </div>
    </div>
  );
};

export default ProductBanner;
