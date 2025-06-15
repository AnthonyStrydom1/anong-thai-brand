
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import NavigationBanner from "@/components/NavigationBanner";
import { BackToShopButton } from "@/components/product/BackToShopButton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const ProductDetailPage = () => {
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow thai-pattern-bg">
        <div className="container mx-auto px-4 py-8">
          <BackToShopButton language={language} />
          <ProductDetail />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
