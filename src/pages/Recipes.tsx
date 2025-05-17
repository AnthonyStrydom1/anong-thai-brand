
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-b from-[#FCFAFF] to-[#F5EBFF] thai-lotus-bg py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-semibold mb-2 text-gray-800 font-display">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
            <div className="w-24 h-1 bg-thai-purple mx-auto mt-5"></div>
          </motion.div>
          
          {/* Filter Categories */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-medium mb-4">{t.categories}</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button 
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className={activeCategory === category.id 
                    ? "bg-thai-purple hover:bg-thai-purple-dark" 
                    : "border-thai-purple text-thai-purple hover:bg-thai-purple/10"
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
                <Card className="premium-card group overflow-hidden">
                  <Link to={`/recipe/${recipe.id}`} className="block overflow-hidden">
                    <div className="h-64 overflow-hidden flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        src={recipe.image} 
                        alt={recipe.name[language]}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to={`/recipe/${recipe.id}`}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1.5 hover:text-thai-purple transition group-hover:text-thai-purple">
                        {recipe.name[language]}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {recipe.description[language]}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <span>{recipe.time} min</span> • <span>{recipe.servings} {language === 'en' ? 'servings' : 'ที่'}</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-white border border-thai-purple text-thai-purple hover:bg-thai-purple hover:text-white transition-colors"
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
