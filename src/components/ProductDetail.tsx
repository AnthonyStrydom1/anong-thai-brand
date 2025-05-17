
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
import { motion } from 'framer-motion';

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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <ProductBreadcrumb productName={product.name[language]} language={language} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-white to-gray-50 p-8 flex items-center justify-center"
        >
          <img 
            src={product.image}
            alt={product.name[language]}
            className="w-4/5 h-4/5 object-contain"
          />
        </motion.div>
        
        {/* Product Info */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>
      </div>
      
      {/* Related Recipes */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.4 }}
      >
        <RelatedRecipes 
          recipes={relatedRecipes} 
          language={language} 
          translations={{
            relatedRecipes: t.relatedRecipes,
            viewRecipe: t.viewRecipe,
            noRecipes: t.noRecipes
          }} 
        />
      </motion.div>
    </div>
  );
};

export default ProductDetail;
