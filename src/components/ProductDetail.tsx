
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseProduct } from '@/hooks/useSupabaseProducts';
import { ProductInfo } from './product/ProductInfo';
import { ProductDetailTabs } from './product/ProductDetailTabs';
import { ProductBreadcrumb } from './product/ProductBreadcrumb';
import { ProductNotFound } from './product/ProductNotFound';
import { RelatedRecipes } from './product/RelatedRecipes';
import { ProductImage } from './product/ProductImage';
import { ProductDetailSkeleton } from './product/ProductDetailSkeleton';
import { BackToShopButton } from './product/BackToShopButton';
import { getProductImage, getProductData, getRelatedRecipes } from './product/ProductDataMapper';
import ProductRatings from './product/ProductRatings';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { recipes } from '@/data/recipes';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const { product, isLoading, error } = useSupabaseProduct(id || '');
  
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound language={language} />;
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const productData = getProductData(product.name);
  const productImage = getProductImage(product.name);

  // Convert Supabase product to the format expected by existing components
  const convertedProduct = {
    id: product.id,
    name: productData.name,
    description: productData.description,
    shortDescription: productData.shortDescription,
    ingredients: productData.ingredients,
    howToUse: { 
      en: productData.howToUse.en.join('. '), 
      th: productData.howToUse.th.join('. ') 
    },
    useIn: productData.howToUse,
    price: product.price,
    image: productImage,
    category: (product.category_id as 'curry-pastes' | 'stir-fry-sauces' | 'dipping-sauces') || 'curry-pastes'
  };

  // Get related recipes based on product name
  const relatedRecipeIds = getRelatedRecipes(product.name);
  const relatedRecipes = recipes.filter(recipe => relatedRecipeIds.includes(recipe.id));

  return (
    <div className="container mx-auto px-4 py-12">
      <BackToShopButton language={language} />
      <ProductBreadcrumb productName={convertedProduct.name[language]} language={language} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductImage 
          image={convertedProduct.image}
          productName={convertedProduct.name[language]}
          fadeInVariants={fadeIn}
        />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <ProductInfo 
            product={convertedProduct} 
            language={language} 
            translations={{
              addToCart: language === 'en' ? 'Add to Cart' : 'เพิ่มลงตะกร้า',
              quantity: language === 'en' ? 'Quantity' : 'จำนวน',
              addedToCart: language === 'en' ? 'Added to cart!' : 'เพิ่มลงตะกร้าแล้ว!'
            }} 
          />
          
          <ProductDetailTabs 
            product={convertedProduct} 
            language={language} 
            translations={{
              description: language === 'en' ? 'Description' : 'รายละเอียด',
              ingredients: language === 'en' ? 'Ingredients' : 'ส่วนผสม',
              howToUse: language === 'en' ? 'How to Use' : 'วิธีใช้'
            }} 
          />
        </motion.div>
      </div>

      <div className="mt-12">
        <ProductRatings productId={product.id} />
      </div>

      {relatedRecipes.length > 0 && (
        <RelatedRecipes 
          recipes={relatedRecipes}
          language={language}
          translations={{
            relatedRecipes: language === 'en' ? 'Related Recipes' : 'สูตรอาหารที่เกี่ยวข้อง',
            viewRecipe: language === 'en' ? 'View Recipe' : 'ดูสูตรอาหาร',
            noRecipes: language === 'en' ? 'No related recipes available' : 'ไม่มีสูตรอาหารที่เกี่ยวข้อง'
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;
