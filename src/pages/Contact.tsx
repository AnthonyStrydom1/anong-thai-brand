
import { useLanguage } from "@/contexts/LanguageContext";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import ContactInfo from "@/components/ContactInfo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const Contact = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow thai-pattern-bg">
        {/* Navigation Buttons */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-4">
            <Button asChild variant="outline" className="bg-white/80 border-anong-gold/30 hover:bg-anong-gold hover:text-anong-black transition-all duration-300">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Home' : 'หน้าหลัก'}
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-white/80 border-anong-gold/30 hover:bg-anong-gold hover:text-anong-black transition-all duration-300">
              <Link to="/shop">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Shop' : 'ร้านค้า'}
              </Link>
            </Button>
          </div>
        </div>
        
        <ContactInfo />
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
