
import React from 'react';
import { Helmet } from 'react-helmet';
import NavigationBanner from '@/components/NavigationBanner';
import MenuGrid from '@/components/MenuGrid';

const Menu = () => {
  return (
    <>
      <Helmet>
        <title>Thai Cuisine Menu - Anong Thai</title>
        <meta name="description" content="Explore our authentic Thai cuisine menu featuring traditional dishes, spices, and ingredients." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <NavigationBanner />
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Our Menu
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover authentic Thai flavors crafted with traditional recipes and premium ingredients
            </p>
          </div>
          
          <MenuGrid />
        </main>
      </div>
    </>
  );
};

export default Menu;
