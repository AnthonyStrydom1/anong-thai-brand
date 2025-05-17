
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recipe } from "@/types";
import { products } from "@/data/products"; 
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="mt-16">
      <h3 className="text-2xl font-semibold mb-6">{translations.relatedRecipes}</h3>
      {recipes.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {recipesWithProductImages.map(recipe => (
            <motion.div key={recipe.id} variants={itemVariants}>
              <Card className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="w-full h-48 relative overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name[language]} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Product images overlay */}
                  {recipe.productImages && recipe.productImages.length > 0 && (
                    <div className="absolute bottom-0 right-0 flex p-2 gap-2">
                      {recipe.productImages.slice(0, 2).map((productImg, idx) => (
                        <div 
                          key={`${recipe.id}-product-${idx}`}
                          className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center p-1"
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
                </div>
                
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold mb-2 text-[#520F7A]">
                    {recipe.name[language]}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description[language]}
                  </p>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
                  >
                    <Link to={`/recipe/${recipe.id}`}>
                      {translations.viewRecipe}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-500 py-8 text-center">{translations.noRecipes}</p>
      )}
    </div>
  );
};
