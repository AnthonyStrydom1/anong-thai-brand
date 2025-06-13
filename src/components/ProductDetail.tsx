
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSupabaseProduct } from '@/hooks/useSupabaseProducts';
import { ProductInfo } from './product/ProductInfo';
import { ProductDetailTabs } from './product/ProductDetailTabs';
import { ProductBreadcrumb } from './product/ProductBreadcrumb';
import { ProductNotFound } from './product/ProductNotFound';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

  // Enhanced image extraction function
  const getProductImage = () => {
    console.log("Product images:", product.images, typeof product.images);
    
    if (product.images) {
      // If it's already an array
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
      }
      
      // If it's a string that might be JSON
      if (typeof product.images === 'string') {
        try {
          const parsed = JSON.parse(product.images);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
          }
          // If it's just a string URL
          return product.images;
        } catch {
          // If JSON parsing fails, treat as direct URL
          return product.images;
        }
      }
      
      // If it's an object (jsonb), try to extract first value
      if (typeof product.images === 'object' && product.images !== null) {
        const values = Object.values(product.images);
        if (values.length > 0 && typeof values[0] === 'string') {
          return values[0];
        }
      }
    }
    
    return '/placeholder.svg';
  };

  // Convert Supabase product to the format expected by existing components
  const convertedProduct = {
    id: product.id,
    name: { 
      en: product.name, 
      th: product.name 
    },
    description: { 
      en: product.description || product.short_description || '', 
      th: product.description || product.short_description || '' 
    },
    shortDescription: { 
      en: product.short_description || '', 
      th: product.short_description || '' 
    },
    ingredients: { 
      en: ['Ingredients information coming soon...'], 
      th: ['ข้อมูลส่วนผสมจะมาเร็วๆ นี้...'] 
    },
    howToUse: { 
      en: 'Usage instructions coming soon...', 
      th: 'คำแนะนำการใช้งานจะมาเร็วๆ นี้...' 
    },
    useIn: { 
      en: ['Usage instructions coming soon...'], 
      th: ['คำแนะนำการใช้งานจะมาเร็วๆ นี้...'] 
    },
    price: product.price,
    image: getProductImage(),
    category: (product.category_id as 'curry-pastes' | 'stir-fry-sauces' | 'dipping-sauces') || 'curry-pastes'
  };

  const productImage = convertedProduct.image;
  console.log("Final product image URL:", productImage);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back to Shop Button */}
      <div className="mb-6">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Back to Shop' : 'กลับไปยังร้านค้า'}
          </Link>
        </Button>
      </div>

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
            src={productImage}
            alt={product.name}
            className="w-4/5 h-4/5 object-contain"
            onError={(e) => {
              console.log("Product detail image failed to load:", productImage);
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
