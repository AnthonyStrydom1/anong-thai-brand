
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CurrencySelector from "@/components/CurrencySelector";

const Shop = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <Header />
      
      <main className="flex-grow">
        {/* Currency selector header */}
        <div className="bg-anong-cream border-b border-anong-gold/10 py-4">
          <div className="container mx-auto px-6 md:px-8 flex justify-end">
            <CurrencySelector />
          </div>
        </div>
        
        <ProductGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
