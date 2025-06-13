
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState, useMemo } from "react";
import NavigationBanner from "@/components/NavigationBanner";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Clock, Users } from "lucide-react";
import { OptimizedLazyImage } from "@/components/ui/optimized-lazy-image";

const Recipes = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const translations = useMemo(() => ({
    en: {
      title: "Traditional Thai Recipes",
      subtitle: "Discover authentic Thai flavors with our carefully curated recipes",
      searchPlaceholder: "Search recipes...",
      categories: {
        all: "All Recipes",
        appetizers: "Appetizers", 
        mains: "Main Dishes",
        soups: "Soups",
        salads: "Salads",
        desserts: "Desserts"
      },
      servings: "servings",
      minutes: "minutes",
      viewRecipe: "View Recipe"
    },
    th: {
      title: "สูตรอาหารไทยดั้งเดิม",
      subtitle: "ค้นพบรสชาติไทยแท้กับสูตรอาหารที่คัดสรรมาอย่างดี",
      searchPlaceholder: "ค้นหาสูตรอาหาร...",
      categories: {
        all: "สูตรทั้งหมด",
        appetizers: "ของทานเล่น",
        mains: "อาหารจานหลัก", 
        soups: "ซุป",
        salads: "สลัด",
        desserts: "ของหวาน"
      },
      servings: "ที่เสิร์ฟ",
      minutes: "นาที",
      viewRecipe: "ดูสูตรอาหาร"
    }
  }), []);
  
  const t = translations[language];
  
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description[language].toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || recipe.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, language]);
  
  const categories = Object.keys(t.categories);
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <NavigationBanner />
      
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="w-16 h-16 mx-auto mb-6">
              <img 
                src="/lovable-uploads/f440215b-ebf7-4c9f-9cf6-412d4018796e.png" 
                alt="ANONG Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="anong-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-anong-black">{t.title}</h1>
            <p className="anong-body text-lg md:text-xl text-anong-black/80 max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>
            
            {/* Thai Lotus Divider */}
            <div className="flex items-center justify-center mt-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-anong-gold to-transparent"></div>
              <div className="mx-8 thai-lotus-divider w-8 h-8"></div>
              <div className="w-24 h-px bg-gradient-to-l from-transparent via-anong-gold to-transparent"></div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-anong-black/60 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 anong-input"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "anong-btn-primary" : "anong-btn-secondary"}
                >
                  {t.categories[category as keyof typeof t.categories]}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="anong-card overflow-hidden group hover:shadow-xl transition-all duration-300">
                <Link to={`/recipes/${recipe.id}`} className="block">
                  <div className="h-48 md:h-56 bg-gradient-to-b from-anong-cream to-anong-ivory p-6 flex items-center justify-center">
                    <OptimizedLazyImage
                      src={recipe.image}
                      alt={recipe.name[language]}
                      className="max-w-[160px] max-h-[160px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="anong-subheading text-xl mb-3 text-anong-black group-hover:text-anong-gold transition-colors line-clamp-2">
                      {recipe.name[language]}
                    </h3>
                    <p className="anong-body-light text-anong-black/70 mb-4 line-clamp-2">
                      {recipe.description[language]}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-anong-black/60">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-anong-gold" />
                        <span>{recipe.time} {t.minutes}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-anong-gold" />
                        <span>{recipe.servings} {t.servings}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
          
          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="anong-body text-anong-black/70">
                {language === 'en' ? 'No recipes found matching your criteria.' : 'ไม่พบสูตรอาหารที่ตรงกับเงื่อนไข'}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
