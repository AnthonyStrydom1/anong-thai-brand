
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const Recipes = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  
  const translations = {
    en: {
      title: "Thai Recipes",
      subtitle: "Discover authentic Thai recipes using Anong's products",
      categories: "Recipe Categories",
      viewRecipe: "View Recipe",
      all: "All Recipes",
      curry: "Curry Dishes",
      stirFry: "Stir-Fry Dishes"
    },
    th: {
      title: "สูตรอาหารไทย",
      subtitle: "ค้นพบสูตรอาหารไทยแท้ๆโดยใช้ผลิตภัณฑ์ของอนงค์",
      categories: "หมวดหมู่สูตรอาหาร",
      viewRecipe: "ดูสูตรอาหาร",
      all: "สูตรทั้งหมด",
      curry: "อาหารประเภทแกง",
      stirFry: "อาหารประเภทผัด"
    }
  };

  const t = translations[language];
  
  const categories = [
    { id: 'all', name: t.all },
    { id: 'curry', name: t.curry },
    { id: 'stir-fry', name: t.stirFry }
  ];
  
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };
  
  const filteredRecipes = activeCategory === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category.includes(activeCategory));
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-anong-cream">
      <Header />
      
      <main className="flex-grow watercolor-bg py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="heading-premium text-4xl lg:text-5xl mb-4 text-anong-dark-green">{t.title}</h1>
            <p className="text-luxury text-lg text-anong-charcoal/80 max-w-2xl mx-auto">{t.subtitle}</p>
            <div className="divider-premium w-24 mx-auto mt-8"></div>
          </motion.div>
          
          {/* Filter Categories */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="heading-elegant text-xl mb-6 text-anong-dark-green">{t.categories}</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button 
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id 
                    ? "btn-premium" 
                    : "btn-outline-premium"
                  }
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </motion.div>
          
          {/* Recipe Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredRecipes.map(recipe => (
              <motion.div key={recipe.id} variants={itemVariants}>
                <Card className="luxury-card group overflow-hidden hover-lift">
                  <Link to={`/recipe/${recipe.id}`} className="block overflow-hidden">
                    <div className="h-64 overflow-hidden flex items-center justify-center bg-gradient-to-b from-anong-cream to-anong-warm-cream">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={recipe.image} 
                        alt={recipe.name[language]}
                        className="w-full h-full object-contain p-6"
                      />
                    </div>
                  </Link>
                  <div className="p-6 relative z-10">
                    <Link to={`/recipe/${recipe.id}`}>
                      <h3 className="heading-elegant text-lg font-medium text-anong-dark-green mb-2 hover:text-anong-gold transition-colors group-hover:text-anong-gold">
                        {recipe.name[language]}
                      </h3>
                    </Link>
                    <p className="text-luxury text-sm text-anong-charcoal/70 mb-6 line-clamp-2">
                      {recipe.description[language]}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-anong-charcoal/60 font-serif">
                        <span>{recipe.time} min</span> • <span>{recipe.servings} {language === 'en' ? 'servings' : 'ที่'}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-anong-cream border border-anong-dark-green text-anong-dark-green hover:bg-anong-dark-green hover:text-anong-cream transition-all duration-300 font-serif"
                        asChild
                      >
                        <Link to={`/recipe/${recipe.id}`} className="flex items-center">
                          <ChevronRight className="h-4 w-4 mr-1" />
                          {t.viewRecipe}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
