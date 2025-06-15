
import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import MenuPreview from '@/components/MenuPreview';
import EventsBanner from '@/components/EventsBanner';
import RestaurantBanner from '@/components/RestaurantBanner';
import TestUserCleanup from '@/components/TestUserCleanup';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <FeaturedProducts />
      <BrandStory />
      <MenuPreview />
      <EventsBanner />
      <RestaurantBanner />
      
      {/* Temporary cleanup utility - remove this after testing */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Development Tools</h2>
          <TestUserCleanup />
        </div>
      </div>
    </div>
  );
};

export default Index;
