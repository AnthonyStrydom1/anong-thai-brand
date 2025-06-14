
import { Card } from "@/components/ui/card";
import RecipeProductCard from "./RecipeProductCard";

interface RelatedProductsProps {
  relatedProducts: any[];
  language: 'en' | 'th';
  t: any;
}

const RelatedProducts = ({ relatedProducts, language, t }: RelatedProductsProps) => {
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Card className="anong-card p-8 md:p-10">
      <h2 className="anong-subheading text-2xl mb-8 text-anong-black">
        {t.productsUsed}
      </h2>
      <div className="space-y-4">
        {relatedProducts.map(product => (
          <RecipeProductCard 
            key={product.id} 
            product={product} 
            language={language} 
            t={t} 
          />
        ))}
      </div>
    </Card>
  );
};

export default RelatedProducts;
