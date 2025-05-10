
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, Users } from "lucide-react";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language, toggleLanguage } = useLanguage();
  
  const recipe = recipes.find(r => r.id === id);
  
  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header currentLanguage={language} toggleLanguage={toggleLanguage} />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">
              {language === 'en' ? 'Recipe not found' : 'ไม่พบสูตรอาหาร'}
            </h2>
            <Link to="/recipes" className="text-thai-purple hover:underline">
              {language === 'en' ? 'Browse all recipes' : 'ดูสูตรอาหารทั้งหมด'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Get related products
  const relatedProducts = products.filter(product => 
    recipe.relatedProducts.includes(product.id)
  );
  
  const translations = {
    en: {
      ingredients: "Ingredients",
      instructions: "Instructions",
      servings: "Servings",
      minutes: "minutes",
      productsUsed: "Products Used in This Recipe",
      viewProduct: "View Product",
      step: "Step"
    },
    th: {
      ingredients: "ส่วนผสม",
      instructions: "วิธีทำ",
      servings: "จำนวนที่เสิร์ฟ",
      minutes: "นาที",
      productsUsed: "ผลิตภัณฑ์ที่ใช้ในสูตรนี้",
      viewProduct: "ดูผลิตภัณฑ์",
      step: "ขั้นตอนที่"
    }
  };
  
  const t = translations[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentLanguage={language} toggleLanguage={toggleLanguage} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-thai-purple transition">
              {language === 'en' ? 'Home' : 'หน้าหลัก'}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/recipes" className="hover:text-thai-purple transition">
              {language === 'en' ? 'Recipes' : 'สูตรอาหาร'}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700">{recipe.name[language]}</span>
          </div>
          
          {/* Recipe Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold mb-4 text-gray-800">
              {recipe.name[language]}
            </h1>
            <div className="flex items-center text-gray-600 mb-6">
              <div className="flex items-center mr-6">
                <Clock className="h-5 w-5 mr-1" />
                <span>{recipe.time} {t.minutes}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-1" />
                <span>{recipe.servings} {t.servings}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Recipe Image */}
              <img 
                src={recipe.image} 
                alt={recipe.name[language]} 
                className="w-full h-auto object-cover rounded-lg mb-8"
              />
              
              {/* Recipe Description */}
              <p className="text-gray-700 mb-8">
                {recipe.description[language]}
              </p>
              
              {/* Instructions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-thai-purple">
                  {t.instructions}
                </h2>
                <div className="space-y-4">
                  {recipe.steps[language].map((step, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="bg-thai-purple text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                      </div>
                      <div className="text-gray-700">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-thai-purple">
                    {t.productsUsed}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedProducts.map(product => (
                      <div key={product.id} className="border rounded-lg overflow-hidden flex">
                        <img 
                          src={product.image} 
                          alt={product.name[language]}
                          className="w-24 h-24 object-cover"
                        />
                        <div className="p-4 flex flex-col justify-between flex-grow">
                          <h3 className="font-medium">{product.name[language]}</h3>
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                            className="border-thai-purple text-thai-purple hover:bg-thai-purple/10 w-full sm:w-auto"
                          >
                            <Link to={`/product/${product.id}`}>{t.viewProduct}</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Ingredients Sidebar */}
            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4 text-thai-purple">
                  {t.ingredients}
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients[language].map((ingredient, index) => (
                    <li key={index} className="text-gray-700 pb-2 border-b border-gray-200 last:border-0">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetail;
