
import { useParams } from "react-router-dom";
import { memo } from "react";
import RecipeDetailContainer from "@/components/recipe/RecipeDetailContainer";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  return <RecipeDetailContainer id={id} />;
};

export default memo(RecipeDetail);
