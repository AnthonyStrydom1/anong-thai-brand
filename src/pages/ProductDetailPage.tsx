
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { language } = useLanguage();
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <ProductDetail />
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
