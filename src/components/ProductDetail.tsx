
import { useParams } from 'react-router-dom';
import { products } from '@/data/products';
import { recipes } from '@/data/recipes';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductInfo } from './product/ProductInfo';
import { ProductDetailTabs } from './product/ProductDetailTabs';
import { RelatedRecipes } from './product/RelatedRecipes';
import { ProductBreadcrumb } from './product/ProductBreadcrumb';
import { ProductNotFound } from './product/ProductNotFound';
import { useProductTranslations } from './product/useProductTranslations';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  
  console.log("Product ID from params:", id);
  console.log("Available products:", products);
  
  const product = products.find(p => p.id === id);
  console.log("Found product:", product);
  
  if (!product) {
    return <ProductNotFound language={language} />;
  }
  
  const relatedRecipes = recipes.filter(recipe => 
    recipe.relatedProducts.includes(product.id)
  );
  
  const t = useProductTranslations(language);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <ProductBreadcrumb productName={product.name[language]} language={language} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-md flex items-center justify-center p-6">
          <img 
            src={product.image} 
            alt={product.name[language]} 
            className="max-w-full max-h-[400px] object-contain"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <ProductInfo 
            product={product} 
            language={language} 
            translations={{
              addToCart: t.addToCart,
              quantity: t.quantity,
              addedToCart: t.addedToCart
            }} 
          />
          
          {/* Product Details Tabs */}
          <ProductDetailTabs 
            product={product} 
            language={language} 
            translations={{
              description: t.description,
              ingredients: t.ingredients,
              howToUse: t.howToUse
            }} 
          />
        </div>
      </div>
      
      {/* Related Recipes */}
      <RelatedRecipes 
        recipes={relatedRecipes} 
        language={language} 
        translations={{
          relatedRecipes: t.relatedRecipes,
          viewRecipe: t.viewRecipe,
          noRecipes: t.noRecipes
        }} 
      />
    </div>
  );
};

export default ProductDetail;
