
import { Card } from "@/components/ui/card";

interface IngredientsSectionProps {
  recipe: any;
  language: 'en' | 'th';
  t: any;
}

const IngredientsSection = ({ recipe, language, t }: IngredientsSectionProps) => {
  return (
    <div className="sticky top-24">
      <Card className="anong-card p-8">
        <h2 className="anong-subheading text-xl mb-6 text-anong-black">
          {t.ingredients}
        </h2>
        <ul className="space-y-3">
          {recipe.ingredients[language].map((ingredient: string, index: number) => (
            <li key={index} className="anong-body text-anong-black/80 pb-3 border-b border-anong-gold/20 last:border-0">
              {ingredient}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default IngredientsSection;
