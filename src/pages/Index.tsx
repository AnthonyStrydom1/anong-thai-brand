
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroBanner from "@/components/HeroBanner";
import AboutPreview from "@/components/AboutPreview";

const Index = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow bg-white">
        <HeroBanner />
        <div className="px-4 md:px-0">
          <AboutPreview />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
