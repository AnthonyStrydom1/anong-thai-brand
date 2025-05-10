
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types";

interface ProductDetailTabsProps {
  product: Product;
  language: 'en' | 'th';
  translations: {
    description: string;
    ingredients: string;
    howToUse: string;
  };
}

export const ProductDetailTabs = ({ product, language, translations }: ProductDetailTabsProps) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">{translations.description}</TabsTrigger>
        <TabsTrigger value="ingredients">{translations.ingredients}</TabsTrigger>
        <TabsTrigger value="howToUse">{translations.howToUse}</TabsTrigger>
      </TabsList>
      <TabsContent value="description" className="pt-4 text-gray-700">
        {product.description[language]}
      </TabsContent>
      <TabsContent value="ingredients" className="pt-4">
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {product.ingredients[language].map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </TabsContent>
      <TabsContent value="howToUse" className="pt-4">
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {product.useIn[language].map((use, index) => (
            <li key={index}>{use}</li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
};
