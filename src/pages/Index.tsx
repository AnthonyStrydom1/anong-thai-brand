
import React from 'react';
import NavigationBanner from '@/components/NavigationBanner';
import HeroBanner from '@/components/HeroBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import MenuPreview from '@/components/MenuPreview';
import EventsBanner from '@/components/EventsBanner';
import RestaurantBanner from '@/components/RestaurantBanner';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <NavigationBanner />
      <HeroBanner />
      <FeaturedProducts />
      <BrandStory />
      <MenuPreview />
      <EventsBanner />
      <RestaurantBanner />
      <Footer />
    </div>
  );
};

export default Index;
