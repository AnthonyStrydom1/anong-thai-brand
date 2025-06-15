
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRecipeDetail } from "@/hooks/useRecipeDetail";
import RecipeNotFoundView from "./RecipeNotFoundView";
import RecipeContent from "./RecipeContent";

interface RecipeDetailContainerProps {
  id: string | undefined;
}

const RecipeDetailContainer = ({ id }: RecipeDetailContainerProps) => {
  const { language } = useLanguage();
  const { recipe, relatedProducts, isLoading } = useRecipeDetail(id);
  
  const translations = useMemo(() => ({
    en: {
      ingredients: "Ingredients",
      instructions: "Instructions",
      servings: "Servings",
      minutes: "minutes",
      productsUsed: "Products Used in This Recipe",
      viewProduct: "View Product",
      step: "Step",
      backToRecipes: "Back to Recipes"
    },
    th: {
      ingredients: "ส่วนผสม",
      instructions: "วิธีทำ",
      servings: "จำนวนที่เสิร์ฟ",
      minutes: "นาที",
      productsUsed: "ผลิตภัณฑ์ที่ใช้ในสูตรนี้",
      viewProduct: "ดูผลิตภัณฑ์",
      step: "ขั้นตอนที่",
      backToRecipes: "กลับสู่สูตรอาหาร"
    }
  }), []);
  
  const t = translations[language];
  
  if (!recipe && id) {
    return <RecipeNotFoundView id={id} language={language} />;
  }

  if (!recipe) {
    return null;
  }

  return (
    <RecipeContent 
      recipe={recipe} 
      relatedProducts={relatedProducts} 
      language={language} 
      t={t} 
    />
  );
};

export default RecipeDetailContainer;
