
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutPreview from "@/components/AboutPreview";

const Index = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentLanguage={language} toggleLanguage={toggleLanguage} />
      
      <main className="flex-grow">
        <HeroBanner />
        <FeaturedProducts />
        <AboutPreview />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
