
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Recipe } from "@/types";

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
  return (
    <div className="mt-16 bg-white">
      <h3 className="text-2xl font-semibold mb-8 text-center">{translations.relatedRecipes}</h3>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map(recipe => (
            <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
              <div className="relative overflow-hidden h-48">
                <img 
                  src={recipe.image} 
                  alt={recipe.name[language]} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-thai-purple text-white text-xs font-medium px-2 py-1 rounded-full">
                  {recipe.time} {language === 'en' ? 'mins' : 'นาที'}
                </div>
              </div>
              <div className="p-5">
                <h4 className="text-lg font-semibold mb-3">
                  {recipe.name[language]}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {recipe.description[language]}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {language === 'en' ? 'Serves' : 'สำหรับ'} {recipe.servings}
                  </span>
                  <Button 
                    asChild
                    variant="outline" 
                    className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
                  >
                    <Link to={`/recipe/${recipe.id}`}>
                      {translations.viewRecipe}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 py-8 text-center">{translations.noRecipes}</p>
      )}
    </div>
  );
};
