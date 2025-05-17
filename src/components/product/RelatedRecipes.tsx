
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
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-gray-100">
                <div className="w-full h-52 relative overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name[language]} 
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Product images overlay */}
                  {recipe.productImages && recipe.productImages.length > 0 && (
                    <div className="absolute bottom-3 right-3 flex p-1 gap-2">
                      {recipe.productImages.slice(0, 2).map((productImg, idx) => (
                        <div 
                          key={`${recipe.id}-product-${idx}`}
                          className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center p-1"
                        >
                          <img 
                            src={productImg} 
                            alt={`Product for ${recipe.name[language]}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <CardContent className="p-5">
                  <h4 className="text-xl font-semibold mb-3 text-[#520F7A] group-hover:text-[#520F7A]">
                    {recipe.name[language]}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description[language]}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span>{recipe.time} min</span> • <span>{recipe.servings} {language === 'en' ? 'servings' : 'ที่'}</span>
                    </div>
                    <Button 
                      asChild
                      variant="outline" 
                      className="border-thai-purple text-thai-purple hover:bg-thai-purple hover:text-white group overflow-hidden"
                    >
                      <Link to={`/recipe/${recipe.id}`} className="flex items-center">
                        {translations.viewRecipe}
                        <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
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
