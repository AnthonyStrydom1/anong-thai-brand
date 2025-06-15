
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recipe } from "@/types";
import { products } from "@/data/products"; 
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface RelatedRecipesProps {
  recipes: Recipe[];
  language: 'en' | 'th';
  translations: {
    relatedRecipes: string;
    viewRecipe: string;
    noRecipes: string;
  };
}

export const RelatedRecipes = ({ recipes, language, translations }: RelatedRecipesProps) => {
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

  // Get product images for each recipe
  const recipesWithProductImages = recipes.map(recipe => {
    const relatedProductImages = recipe.relatedProducts
      .map(productId => products.find(p => p.id === productId)?.image)
      .filter(Boolean);
      
    return {
      ...recipe,
      productImages: relatedProductImages
    };
  });

  return (
    <div className="mt-24">
      <div className="flex items-center mb-8">
        <h3 className="text-2xl font-display font-semibold text-gray-800">{translations.relatedRecipes}</h3>
        <div className="h-1 bg-thai-purple flex-grow ml-4"></div>
      </div>

      {recipes.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {recipesWithProductImages.map(recipe => (
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
                <CardContent className="p-5">
                  <Link to={`/recipe/${recipe.id}`}>
                    <h4 className="text-lg font-semibold mb-3 text-gray-800 group-hover:text-thai-purple transition">
                      {recipe.name[language]}
                    </h4>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description[language]}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span>{recipe.time} min</span> • <span>{recipe.servings} {language === 'en' ? 'servings' : 'ที่'}</span>
                    </div>
                    <Button 
                      variant="gold" 
                      size="sm" 
                      className="bg-anong-gold text-anong-black hover:bg-anong-warm-yellow font-medium"
                      asChild
                    >
                      <Link to={`/recipe/${recipe.id}`} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mr-1" />
                        {translations.viewRecipe}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-gray-50 rounded-lg py-16 text-center">
          <p className="text-gray-500">{translations.noRecipes}</p>
        </div>
      )}
    </div>
  );
};
