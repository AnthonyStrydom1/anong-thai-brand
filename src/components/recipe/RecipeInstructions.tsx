
import { Card } from "@/components/ui/card";

interface RecipeInstructionsProps {
  recipe: any;
  language: 'en' | 'th';
  t: any;
}

const RecipeInstructions = ({ recipe, language, t }: RecipeInstructionsProps) => {
  return (
    <Card className="anong-card p-8 md:p-10">
      <h2 className="anong-subheading text-2xl mb-8 text-anong-black">
        {t.instructions}
      </h2>
      <div className="space-y-6">
        {recipe.steps[language].map((step: string, index: number) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-anong-gold text-anong-black w-8 h-8 rounded-full flex items-center justify-center font-medium anong-body text-sm">
                {index + 1}
              </div>
            </div>
            <div className="anong-body text-anong-black/80 leading-relaxed">{step}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecipeInstructions;
