
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <Header />
      <main className="flex-grow flex items-center justify-center watercolor-bg py-16">
        <div className="text-center px-4 luxury-card max-w-md mx-auto p-12">
          <h1 className="text-6xl font-display font-light text-anong-dark-green mb-6">404</h1>
          <p className="text-xl text-anong-charcoal mb-8 font-serif">Page not found</p>
          <Button asChild className="btn-premium">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
