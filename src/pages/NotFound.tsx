
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const translations = {
    en: {
      title: "404",
      message: "Page not found",
      returnHome: "Return to Home"
    },
    th: {
      title: "404",
      message: "ไม่พบหน้าที่ค้นหา",
      returnHome: "กลับสู่หน้าหลัก"
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <main className="flex-grow flex items-center justify-center watercolor-bg py-16">
        <div className="text-center px-4 luxury-card max-w-md mx-auto p-12">
          <h1 className="text-6xl font-display font-light text-anong-dark-green mb-6">{t.title}</h1>
          <p className="text-xl text-anong-charcoal mb-8 font-serif">{t.message}</p>
          <Button asChild className="btn-premium">
            <Link to="/">{t.returnHome}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
