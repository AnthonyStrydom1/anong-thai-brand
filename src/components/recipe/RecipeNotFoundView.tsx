
import { Link } from "react-router-dom";
import { recipes } from "@/data/recipes";
import Footer from "@/components/Footer";

interface RecipeNotFoundViewProps {
  id: string;
  language: 'en' | 'th';
}

const RecipeNotFoundView = ({ id, language }: RecipeNotFoundViewProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-anong-ivory">
      <main className="flex-grow anong-section">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="anong-heading text-2xl mb-4 text-anong-black">
            {language === 'en' ? 'Recipe not found' : 'ไม่พบสูตรอาหาร'}
          </h2>
          <p className="anong-body text-anong-black/70 mb-6">
            {language === 'en' 
              ? `The recipe with ID "${id}" could not be found.` 
              : `ไม่พบสูตรอาหารที่มี ID "${id}"`
            }
          </p>
          <div className="space-y-4">
            <Link to="/recipes" className="anong-btn-primary">
              {language === 'en' ? 'Browse all recipes' : 'ดูสูตรอาหารทั้งหมด'}
            </Link>
            <div className="text-sm text-gray-500">
              <p>Available recipe IDs:</p>
              <div className="max-w-md mx-auto text-left bg-gray-100 p-4 rounded mt-2">
                {recipes.map(r => (
                  <div key={r.id} className="mb-1">
                    <Link to={`/recipe/${r.id}`} className="text-blue-600 hover:underline">
                      {r.id} - {r.name[language]}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeNotFoundView;
