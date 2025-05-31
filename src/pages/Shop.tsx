
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Shop = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <Header />
      
      <main className="flex-grow px-4 md:px-0 watercolor-bg">
        <ProductGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
