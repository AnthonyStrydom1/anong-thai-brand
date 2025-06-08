import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { OptimizedLazyImage } from "@/components/ui/optimized-lazy-image";
import { FastRecipeSkeleton } from "@/components/ui/minimal-skeleton";

const RecipeCard = memo(({ recipe, language, t }: { 
  recipe: any; 
  language: 'en' | 'th'; 
  t: any;
}) => (
  <Card className="anong-card anong-hover-lift overflow-hidden group">
    <Link to={`/recipes/${recipe.id}`} className="block">
      <div className="h-64 overflow-hidden flex items-center justify-center bg-gradient-to-b from-anong-cream to-anong-ivory">
        <OptimizedLazyImage
          src={recipe.image}
          alt={recipe.name[language]}
          className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          containerClassName="w-full h-full relative"
          eager={false}
        />
      </div>
    </Link>
    <div className="p-6 relative z-10">
      <Link to={`/recipes/${recipe.id}`}>
        <h3 className="anong-subheading text-lg font-medium text-anong-black mb-2 hover:text-anong-gold transition-colors">
          {recipe.name[language]}
        </h3>
      </Link>
      <p className="anong-body-light text-sm text-anong-black/70 mb-6 line-clamp-2">
        {recipe.description[language]}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-sm text-anong-black/60">
          <Clock className="h-4 w-4 mr-1 text-anong-gold" />
          <span className="mr-3">{recipe.time} min</span>
          <Users className="h-4 w-4 mr-1 text-anong-gold" />
          <span>{recipe.servings} {language === 'en' ? 'servings' : 'ที่'}</span>
        </div>
        <Button 
          size="sm" 
          className="anong-btn-secondary text-xs px-4 py-2 rounded-full"
          asChild
        >
          <Link to={`/recipes/${recipe.id}`} className="flex items-center">
            <ChevronRight className="h-3 w-3 mr-1" />
            {t.viewRecipe}
          </Link>
        </Button>
      </div>
    </div>
  </Card>
));

RecipeCard.displayName = 'RecipeCard';

const Recipes = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // Very fast initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);
  
  const translations = useMemo(() => ({
    en: {
      title: "Thai Recipe Collection",
      subtitle: "Authentic Thai recipes crafted with ANONG's premium products and time-honored techniques",
      categories: "Recipe Categories",
      viewRecipe: "View Recipe",
      all: "All Recipes",
      curry: "Curry Dishes",
      stirFry: "Stir-Fry Dishes",
      traditional: "Traditional Thai",
      craftedWith: "Crafted with tradition, perfected with time"
    },
    th: {
      title: "คลังสูตรอาหารไทย",
      subtitle: "สูตรอาหารไทยแท้ที่สร้างด้วยผลิตภัณฑ์พรีเมียมของอนองค์และเทคนิคที่สืบทอดมาแต่โบราณ",
      categories: "หมวดหมู่สูตรอาหาร",
      viewRecipe: "ดูสูตรอาหาร",
      all: "สูตรทั้งหมด",
      curry: "อาหารประเภทแกง",
      stirFry: "อาหารประเภทผัด",
      traditional: "อาหารไทยดั้งเดิม",
      craftedWith: "สร้างด้วยประเพณี สมบูรณ์แบบด้วยเวลา"
    }
  }), []);

  const t = translations[language];
  
  const categories = useMemo(() => [
    { id: 'all', name: t.all },
    { id: 'curry', name: t.curry },
    { id: 'stir-fry', name: t.stirFry }
  ], [t]);
  
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);
  
  const filteredRecipes = useMemo(() => {
    return activeCategory === 'all' 
      ? recipes 
      : recipes.filter(recipe => recipe.category && recipe.category.includes(activeCategory));
  }, [activeCategory]);
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16 md:mb-20">
            <div className="w-16 h-16 mx-auto mb-6">
              <img 
                src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                alt="ANONG Logo"
                className="w-full h-full object-contain"
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black">{t.title}</h1>
            <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed mb-8">{t.subtitle}</p>
            
            <div className="flex items-center justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
              <div className="mx-8 thai-lotus-divider w-8 h-8"></div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
            </div>
            
            <p className="anong-body-light text-sm tracking-wide text-anong-gold mt-6 font-medium">
              {t.craftedWith}
            </p>
          </div>
          
          {/* Filter Categories */}
          <div className="mb-12 md:mb-16">
            <div className="anong-card p-8 md:p-10">
              <h2 className="anong-subheading text-xl mb-6 text-anong-black">{t.categories}</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button 
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className={activeCategory === category.id 
                      ? "anong-btn-primary rounded-full" 
                      : "border-anong-gold/30 text-anong-black hover:bg-anong-gold hover:text-anong-black rounded-full"
                    }
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recipe Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {Array.from({ length: 6 }).map((_, index) => (
                <FastRecipeSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  language={language} 
                  t={t} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default memo(Recipes);
