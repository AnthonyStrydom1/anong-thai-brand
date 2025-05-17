
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutPreview from "@/components/AboutPreview";
import ContactInfo from "@/components/ContactInfo";
import RestaurantBanner from "@/components/RestaurantBanner";

const Index = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <HeroBanner />
        <div className="px-4 md:px-0">
          <FeaturedProducts />
          <RestaurantBanner />
          <AboutPreview />
          <ContactInfo />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
