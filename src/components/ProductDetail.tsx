
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

  // Generate the mockup based on product category
  const renderProductMockup = () => {
    const isJar = product.category === 'curry-pastes' || product.category === 'dipping-sauces';
    
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-md flex items-center justify-center p-8">
        <div className={`relative ${isJar ? 'w-64 h-80' : 'w-48 h-80'} mx-auto`}>
          {/* Mockup container */}
          <div className={`${isJar ? 'rounded-3xl' : 'rounded-lg'} overflow-hidden bg-transparent h-full w-full flex items-center justify-center`}>
            {/* Glass jar/bottle effect */}
            <div className={`absolute inset-0 ${isJar ? 'rounded-3xl' : 'rounded-lg'} bg-black bg-opacity-5 backdrop-blur-sm`}></div>
            
            {/* Product reflection/highlight */}
            <div className={`absolute inset-y-0 left-0 w-1/4 ${isJar ? 'rounded-l-3xl' : 'rounded-l-lg'} bg-white bg-opacity-10`}></div>
            
            {/* Product label */}
            <div className={`absolute inset-0 flex items-center justify-center ${isJar ? 'px-6' : 'px-3'}`}>
              <img 
                src={product.image} 
                alt={product.name[language]} 
                className="max-h-[85%] max-w-[85%] object-contain z-10"
              />
            </div>
            
            {/* Jar/bottle lid */}
            <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 ${isJar ? 'w-40 h-6' : 'w-20 h-8'} rounded-t-lg bg-black`}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <ProductBreadcrumb productName={product.name[language]} language={language} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        {renderProductMockup()}
        
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
