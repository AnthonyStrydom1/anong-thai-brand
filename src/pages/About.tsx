
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";
import { useEffect } from "react";

const About = () => {
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBanner />
      
      <main className="flex-grow">
        <AboutContent />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
