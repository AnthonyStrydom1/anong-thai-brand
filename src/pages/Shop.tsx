
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Shop = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Get category from URL parameters
  const categoryFromUrl = searchParams.get('category');
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow thai-pattern-bg">
        <ProductGrid initialCategory={categoryFromUrl} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
