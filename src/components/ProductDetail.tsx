
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
        {/* Product Image as Jar Mockup */}
        <div className="bg-black rounded-lg overflow-hidden shadow-md flex items-center justify-center p-8 min-h-[500px]">
          <div className="relative w-full max-w-[300px] h-[400px] mx-auto">
            {/* Jar/bottle container - 3D effect with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(255,255,255,0.2)] rounded-lg" style={{
              clipPath: 'polygon(20% 0%, 80% 0%, 90% 5%, 90% 95%, 80% 100%, 20% 100%, 10% 95%, 10% 5%)'
            }}></div>
            
            {/* Product image as the label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name[language]} 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Jar lid */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60%] h-[8%] bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-lg"></div>
            
            {/* Jar reflections */}
            <div className="absolute top-[15%] right-[15%] w-[5%] h-[70%] bg-white opacity-20 rounded-full"></div>
            <div className="absolute top-[20%] left-[15%] w-[3%] h-[60%] bg-white opacity-10 rounded-full"></div>
          </div>
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
