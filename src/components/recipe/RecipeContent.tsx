
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import RecipeHeader from "@/components/recipe/RecipeHeader";
import RecipeInstructions from "@/components/recipe/RecipeInstructions";
import RelatedProducts from "@/components/recipe/RelatedProducts";
import IngredientsSection from "@/components/recipe/IngredientsSection";
import RecipeImageCard from "@/components/recipe/RecipeImageCard";
import Footer from "@/components/Footer";

interface RecipeContentProps {
  recipe: any;
  relatedProducts: any[];
  language: 'en' | 'th';
  t: any;
}

const RecipeContent = ({ recipe, relatedProducts, language, t }: RecipeContentProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow anong-section thai-pattern-bg">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-8 md:py-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/recipes" className="flex items-center text-anong-black hover:text-anong-gold transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="anong-body text-sm">{t.backToRecipes}</span>
            </Link>
          </div>
          
          {/* Recipe Header */}
          <RecipeHeader recipe={recipe} language={language} t={t} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              {/* Recipe Image */}
              <RecipeImageCard recipe={recipe} language={language} />
              
              {/* Instructions */}
              <RecipeInstructions recipe={recipe} language={language} t={t} />
              
              {/* Related Products */}
              <RelatedProducts relatedProducts={relatedProducts} language={language} t={t} />
            </div>
            
            {/* Ingredients Sidebar */}
            <div>
              <IngredientsSection recipe={recipe} language={language} t={t} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeContent;
