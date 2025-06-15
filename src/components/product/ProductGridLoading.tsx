
import React from 'react';
import NavigationBanner from '../NavigationBanner';

interface ProductGridLoadingProps {
  loadingText: string;
}

const ProductGridLoading: React.FC<ProductGridLoadingProps> = ({ loadingText }) => {
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      <section className="anong-section px-4 md:px-6 bg-gradient-to-b from-anong-ivory to-anong-cream thai-pattern-bg">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-16">
            <div className="anong-card max-w-md mx-auto p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-anong-gold/20 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-anong-gold/20 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="anong-body text-anong-charcoal/70 mt-4">{loadingText}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductGridLoading;
