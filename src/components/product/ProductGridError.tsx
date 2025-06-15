
import React from 'react';
import NavigationBanner from '../NavigationBanner';

interface ProductGridErrorProps {
  errorTitle: string;
  error: string;
}

const ProductGridError: React.FC<ProductGridErrorProps> = ({ errorTitle, error }) => {
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      <section className="anong-section px-4 md:px-6 bg-gradient-to-b from-anong-ivory to-anong-cream thai-pattern-bg">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-16">
            <div className="anong-card max-w-md mx-auto p-8 border-red-200 bg-red-50/50">
              <p className="text-red-600 mb-4 font-medium">{errorTitle}</p>
              <p className="text-anong-charcoal/60">{error}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductGridError;
