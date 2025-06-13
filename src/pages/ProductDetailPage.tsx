
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import NavigationBanner from "@/components/NavigationBanner";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <NavigationBanner />
      
      <main className="flex-grow watercolor-bg">
        <ProductDetail />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
