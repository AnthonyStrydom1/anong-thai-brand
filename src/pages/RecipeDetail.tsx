
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
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
  console.log('ProductCard rendering:', product.name[language]);
  
  return (
    <div className="anong-card anong-hover-lift overflow-hidden group">
      <div className="flex h-32">
        <div className="w-1/3 bg-gradient-to-b from-anong-cream to-anong-ivory flex items-center justify-center p-3">
          <OptimizedLazyImage
            src={product.image}
            alt={product.name[language]}
            className="w-full h-full object-contain"
            containerClassName="w-full h-full relative"
          />
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="anong-body font-medium text-anong-black group-hover:text-anong-gold transition-colors mb-2">
              {product.name[language]}
            </h3>
            <p className="anong-body-light text-xs text-anong-black/60 line-clamp-2 mb-3">
              {product.shortDescription[language]}
            </p>
          </div>
          <Button 
            asChild
            size="sm"
            className="anong-btn-secondary text-xs px-3 py-2 h-auto self-start"
          >
            <Link to={`/product/${product.id}`} className="flex items-center">
              <ChevronRight className="h-3 w-3 mr-1" />
              {t.viewProduct}
            </Link>
          </Button>
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
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);
  
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
        <Header />
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
      <Header />
      
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
              {/* Recipe Image */}
              <Card className="anong-card overflow-hidden">
                <div className="h-64 md:h-80 bg-gradient-to-b from-anong-cream to-anong-ivory p-8 flex items-center justify-center">
                  <OptimizedLazyImage
                    src={recipe.image}
                    alt={recipe.name[language]}
                    className="w-full h-full object-contain"
                    containerClassName="w-full h-full relative"
                    priority={true}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
