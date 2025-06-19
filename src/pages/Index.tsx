
import React from 'react';
import NavigationBanner from '@/components/NavigationBanner';
import HeroBanner from '@/components/HeroBanner';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandStory from '@/components/BrandStory';
import EventsBanner from '@/components/EventsBanner';
import RestaurantBanner from '@/components/RestaurantBanner';
import Footer from '@/components/Footer';
import { ComponentErrorBoundary } from '@/components/ErrorBoundary';

const Index = () => {
  console.log('🏠 Index page rendering...');

  return (
    <div className="min-h-screen">
      <ComponentErrorBoundary componentName="NavigationBanner">
        <NavigationBanner />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="HeroBanner">
        <HeroBanner />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="FeaturedProducts">
        <FeaturedProducts />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="BrandStory">
        <BrandStory />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="EventsBanner">
        <EventsBanner />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="RestaurantBanner">
        <RestaurantBanner />
      </ComponentErrorBoundary>
      
      <ComponentErrorBoundary componentName="Footer">
        <Footer />
      </ComponentErrorBoundary>
    </div>
  );
};

export default Index;
