
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
  
  const { product, isLoading, error } = useSupabaseProduct(id || '');
  
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

  // Enhanced image extraction with exact mapping
  const getProductImage = () => {
    const imageMap: { [key: string]: string } = {
      'Pad Thai Sauce': '/lovable-uploads/5a0dec88-a26c-4e29-bda6-8d921887615e.png',
      'Sukiyaki Dipping Sauce': '/lovable-uploads/322ef915-5db5-4834-9e45-92a34dc3adb6.png',
      'Tom Yum Chili Paste': '/lovable-uploads/fc66a288-b44b-4bf4-a82f-a2c844b58979.png',
      'Red Curry Paste': '/lovable-uploads/dbb561f8-a97a-447c-8946-5a1d279bed05.png',
      'Panang Curry Paste': '/lovable-uploads/5308a5d2-4f12-42ed-b3f8-f2aa5d7fbac9.png',
      'Massaman Curry Paste': '/lovable-uploads/c936ed96-2c61-4919-9e6d-14f740c80b80.png',
      'Green Curry Paste': '/lovable-uploads/1ae4d3c5-e136-4ed4-9a71-f1e9d6123a83.png',
      'Yellow Curry Paste': '/lovable-uploads/acf32ec1-9435-4a5c-8baf-1943b85b93bf.png'
    };

    return imageMap[product.name] || '/placeholder.svg';
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
          className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-anong-cream to-anong-ivory p-12 flex items-center justify-center"
        >
          <img 
            src={convertedProduct.image}
            alt={product.name}
            className="max-w-[320px] max-h-[320px] w-auto h-auto object-contain"
            loading="eager"
            decoding="async"
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
