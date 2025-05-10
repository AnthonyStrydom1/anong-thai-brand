
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { recipes } from "@/data/recipes";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Recipes = () => {
  const { language, toggleLanguage } = useLanguage();
  
  const translations = {
    en: {
      title: "Thai Recipes",
      subtitle: "Discover authentic Thai recipes using Anong's products",
      categories: "Recipe Categories",
      viewRecipe: "View Recipe",
      all: "All Recipes",
      curry: "Curry Dishes",
      stirFry: "Stir-Fry Dishes",
      vegetarian: "Vegetarian"
    },
    th: {
      title: "สูตรอาหารไทย",
      subtitle: "ค้นพบสูตรอาหารไทยแท้ๆโดยใช้ผลิตภัณฑ์ของอนงค์",
      categories: "หมวดหมู่สูตรอาหาร",
      viewRecipe: "ดูสูตรอาหาร",
      all: "สูตรทั้งหมด",
      curry: "อาหารประเภทแกง",
      stirFry: "อาหารประเภทผัด",
      vegetarian: "อาหารเจ/มังสวิรัติ"
    }
  };

  const t = translations[language];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentLanguage={language} toggleLanguage={toggleLanguage} />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold mb-2 text-gray-800">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          
          {/* Filter Categories */}
          <div className="mb-10">
            <h2 className="text-xl font-medium mb-4">{t.categories}</h2>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="default" 
                className="bg-thai-purple hover:bg-thai-purple-dark"
              >
                {t.all}
              </Button>
              <Button 
                variant="outline"
                className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
              >
                {t.curry}
              </Button>
              <Button 
                variant="outline"
                className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
              >
                {t.stirFry}
              </Button>
              <Button 
                variant="outline"
                className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
              >
                {t.vegetarian}
              </Button>
            </div>
          </div>
          
          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map(recipe => (
              <div key={recipe.id} className="thai-card">
                <img 
                  src={recipe.image} 
                  alt={recipe.name[language]} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{recipe.name[language]}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description[language]}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span>{recipe.time} min</span> • <span>{recipe.servings} {language === 'en' ? 'servings' : 'ที่'}</span>
                    </div>
                    <Button 
                      asChild
                      variant="outline" 
                      className="border-thai-purple text-thai-purple hover:bg-thai-purple/10"
                    >
                      <Link to={`/recipe/${recipe.id}`}>{t.viewRecipe}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Recipes;
