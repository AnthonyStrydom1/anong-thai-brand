
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
    <div className="mt-16">
      <h3 className="text-2xl font-semibold mb-6">{translations.relatedRecipes}</h3>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="thai-card">
              <img 
                src={recipe.image} 
                alt={recipe.name[language]} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2">
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
