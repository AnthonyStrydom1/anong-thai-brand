
import { Clock, Users } from "lucide-react";

interface RecipeHeaderProps {
  recipe: any;
  language: 'en' | 'th';
  t: any;
}

const RecipeHeader = ({ recipe, language, t }: RecipeHeaderProps) => {
  return (
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
  );
};

export default RecipeHeader;
