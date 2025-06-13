
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseProduct } from '@/hooks/useSupabaseProducts';
import { ProductInfo } from './product/ProductInfo';
import { ProductDetailTabs } from './product/ProductDetailTabs';
import { ProductBreadcrumb } from './product/ProductBreadcrumb';
import { ProductNotFound } from './product/ProductNotFound';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  
  console.log("Product ID from params:", id);
  
  const { product, isLoading, error } = useSupabaseProduct(id || '');
  
  console.log("Found product:", product);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
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

  // Convert Supabase product to the format expected by existing components
  const convertedProduct = {
    id: product.id,
    name: { [language]: product.name },
    description: { [language]: product.description || product.short_description || '' },
    shortDescription: { [language]: product.short_description || '' },
    ingredients: { [language]: 'Ingredients information coming soon...' },
    howToUse: { [language]: 'Usage instructions coming soon...' },
    useIn: { [language]: ['Usage instructions coming soon...'] },
    price: product.price,
    image: Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? product.images : '/placeholder.svg'),
    category: (product.category_id as 'curry-pastes' | 'stir-fry-sauces' | 'dipping-sauces') || 'curry-pastes'
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <ProductBreadcrumb productName={product.name} language={language} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-white to-gray-50 p-8 flex items-center justify-center"
        >
          <img 
            src={convertedProduct.image}
            alt={product.name}
            className="w-4/5 h-4/5 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
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
            product={convertedProduct} 
            language={language} 
            translations={{
              addToCart: language === 'en' ? 'Add to Cart' : 'เพิ่มลงตะกร้า',
              quantity: language === 'en' ? 'Quantity' : 'จำนวน',
              addedToCart: language === 'en' ? 'Added to cart!' : 'เพิ่มลงตะกร้าแล้ว!'
            }} 
          />
          
          {/* Product Details Tabs */}
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
    </div>
  );
};

export default ProductDetail;
