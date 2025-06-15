
import { Card } from "@/components/ui/card";

interface RecipeImageCardProps {
  recipe: any;
  language: 'en' | 'th';
}

const RecipeImageCard = ({ recipe, language }: RecipeImageCardProps) => {
  return (
    <Card className="anong-card overflow-hidden">
      <div className="h-64 md:h-80 bg-gradient-to-b from-anong-cream to-anong-ivory p-8 flex items-center justify-center">
        <img
          src={recipe.image}
          alt={recipe.name[language]}
          className="max-w-[320px] max-h-[320px] w-auto h-auto object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
    </Card>
  );
};

export default RecipeImageCard;
