import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Shop = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow">
        <ProductGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
