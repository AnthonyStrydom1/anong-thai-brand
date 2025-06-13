
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import MenuPreview from "@/components/MenuPreview";
import { useEffect } from "react";

const Menu = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow">
        <MenuPreview />
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
