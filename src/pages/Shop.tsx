
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Shop = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentLanguage={language} toggleLanguage={toggleLanguage} />
      
      <main className="flex-grow">
        <ProductGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
