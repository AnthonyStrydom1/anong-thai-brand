
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
            {/* Glass jar container */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800/80 to-black rounded-lg"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 85% 5%, 85% 95%, 75% 100%, 25% 100%, 15% 95%, 15% 5%)'
              }}>
              {/* Glass reflections */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/10 to-black/0"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent" style={{ height: '20%' }}></div>
              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white/5 to-transparent" style={{ height: '30%' }}></div>
            </div>
            
            {/* Product label positioned in the center of the jar */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="relative w-[70%] h-[70%] overflow-hidden rounded">
                <img 
                  src={product.image} 
                  alt={product.name[language]} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Jar lid */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[50%] h-[8%] bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-md"></div>
            
            {/* Realistic jar reflections */}
            <div className="absolute top-[15%] right-[15%] w-[3%] h-[70%] bg-white opacity-30 rounded-full"></div>
            <div className="absolute top-[25%] left-[20%] w-[2%] h-[50%] bg-white opacity-20 rounded-full"></div>
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
