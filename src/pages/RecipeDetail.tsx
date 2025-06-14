import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, Users, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OptimizedLazyImage } from "@/components/ui/optimized-lazy-image";
import { useState, useEffect, memo, useMemo } from "react";

const ProductCard = memo(({ product, language, t }: { 
  product: any; 
  language: 'en' | 'th'; 
  t: any;
}) => {
  // Enhanced image mapping for recipe products
  const getProductImage = () => {
    const imageMap: { [key: string]: string } = {
      'pad-thai-sauce': '/lovable-uploads/5a0dec88-a26c-4e29-bda6-8d921887615e.png',
      'sukiyaki-sauce': '/lovable-uploads/322ef915-5db5-4834-9e45-92a34dc3adb6.png',
      'tom-yum-paste': '/lovable-uploads/fc66a288-b44b-4bf4-a82f-a2c844b58979.png',
      'red-curry-paste': '/lovable-uploads/dbb561f8-a97a-447c-8946-5a1d279bed05.png',
      'panang-curry-paste': '/lovable-uploads/5308a5d2-4f12-42ed-b3f8-f2aa5d7fbac9.png',
      'massaman-curry-paste': '/lovable-uploads/c936ed96-2c61-4919-9e6d-14f740c80b80.png',
      'green-curry-paste': '/lovable-uploads/1ae4d3c5-e136-4ed4-9a71-f1e9d6123a83.png',
      'yellow-curry-paste': '/lovable-uploads/acf32ec1-9435-4a5c-8baf-1943b85b93bf.png'
    };

    return imageMap[product.id] || product.image || '/placeholder.svg';
  };
  
  return (
    <div className="bg-white rounded-lg border border-anong-gold/20 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="flex">
        <div className="w-32 h-32 bg-gradient-to-b from-anong-cream to-anong-ivory flex items-center justify-center p-6">
          <img
            src={getProductImage()}
            alt={product.name[language]}
            className="max-w-[80px] max-h-[80px] w-auto h-auto object-contain"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="anong-subheading text-lg font-medium text-anong-black group-hover:text-anong-gold transition-colors mb-2">
              {product.name[language]}
            </h3>
            <p className="anong-body-light text-sm text-anong-black/70 line-clamp-2 mb-3">
              {product.shortDescription[language]}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="w-16 h-px bg-anong-gold/60"></div>
            <Button 
              asChild
              size="sm"
              className="anong-btn-secondary text-xs px-4 py-2 h-auto rounded-full"
            >
              <Link to={`/product/${product.id}`} className="flex items-center">
                {t.viewProduct}
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  const recipe = useMemo(() => recipes.find(r => r.id === id), [id]);
  
  useEffect(() => {
    // Scroll to top when component mounts or recipe changes
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setIsLoading(false);
  }, [id]);
  
  const relatedProducts = useMemo(() => {
    if (!recipe) return [];
    
    console.log('Recipe related products:', recipe.relatedProducts);
    const matchedProducts = products.filter(product => 
      recipe.relatedProducts.includes(product.id)
    );
    console.log('Matched products:', matchedProducts.map(p => p.id));
    return matchedProducts;
  }, [recipe]);
  
  const translations = useMemo(() => ({
    en: {
      ingredients: "Ingredients",
      instructions: "Instructions",
      servings: "Servings",
      minutes: "minutes",
      productsUsed: "Products Used in This Recipe",
      viewProduct: "View Product",
      step: "Step",
      backToRecipes: "Back to Recipes"
    },
    th: {
      ingredients: "ส่วนผสม",
      instructions: "วิธีทำ",
      servings: "จำนวนที่เสิร์ฟ",
      minutes: "นาที",
      productsUsed: "ผลิตภัณฑ์ที่ใช้ในสูตรนี้",
      viewProduct: "ดูผลิตภัณฑ์",
      step: "ขั้นตอนที่",
      backToRecipes: "กลับสู่สูตรอาหาร"
    }
  }), []);
  
  const t = translations[language];
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-anong-ivory">
        <main className="flex-grow anong-section">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="anong-heading text-2xl mb-4 text-anong-black">
              {language === 'en' ? 'Recipe not found' : 'ไม่พบสูตรอาหาร'}
            </h2>
            <Link to="/recipes" className="anong-btn-primary">
              {language === 'en' ? 'Browse all recipes' : 'ดูสูตรอาหารทั้งหมด'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8 md:py-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/recipes" className="flex items-center text-anong-black hover:text-anong-gold transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="anong-body text-sm">{t.backToRecipes}</span>
            </Link>
          </div>
          
          {/* Recipe Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="anong-heading text-3xl md:text-4xl lg:text-5xl mb-6 text-anong-black">
              {recipe.name[language]}
            </h1>
            <p className="anong-body text-lg text-anong-black/80 max-w-3xl mx-auto mb-8">
              {recipe.description[language]}
            </p>
            
            <div className="flex items-center justify-center gap-8 text-anong-black/70">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-anong-gold" />
                <span className="anong-body">{recipe.time} {t.minutes}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-anong-gold" />
                <span className="anong-body">{recipe.servings} {t.servings}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              {/* Recipe Image - Load eagerly since it's the main content */}
              <Card className="anong-card overflow-hidden">
                <div className="h-64 md:h-80 bg-gradient-to-b from-anong-cream to-anong-ivory p-8 flex items-center justify-center">
                  <img
                    src={recipe.image}
                    alt={recipe.name[language]}
                    className="max-w-[320px] max-h-[320px] w-auto h-auto object-contain"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </Card>
              
              {/* Instructions */}
              <Card className="anong-card p-8 md:p-10">
                <h2 className="anong-subheading text-2xl mb-8 text-anong-black">
                  {t.instructions}
                </h2>
                <div className="space-y-6">
                  {recipe.steps[language].map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="bg-anong-gold text-anong-black w-8 h-8 rounded-full flex items-center justify-center font-medium anong-body text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="anong-body text-anong-black/80 leading-relaxed">{step}</div>
                    </div>
                  ))}
                </div>
              </Card>
              
              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <Card className="anong-card p-8 md:p-10">
                  <h2 className="anong-subheading text-2xl mb-8 text-anong-black">
                    {t.productsUsed}
                  </h2>
                  <div className="space-y-4">
                    {relatedProducts.map(product => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        language={language} 
                        t={t} 
                      />
                    ))}
                  </div>
                </Card>
              )}
            </div>
            
            {/* Ingredients Sidebar */}
            <div>
              <div className="sticky top-24">
                <Card className="anong-card p-8">
                  <h2 className="anong-subheading text-xl mb-6 text-anong-black">
                    {t.ingredients}
                  </h2>
                  <ul className="space-y-3">
                    {recipe.ingredients[language].map((ingredient, index) => (
                      <li key={index} className="anong-body text-anong-black/80 pb-3 border-b border-anong-gold/20 last:border-0">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default memo(RecipeDetail);
