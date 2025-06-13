
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import AboutPreview from "@/components/AboutPreview";

const About = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <NavigationBanner />
      
      <main className="flex-grow">
        <AboutPreview />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
