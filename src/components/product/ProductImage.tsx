
import { motion } from 'framer-motion';

interface ProductImageProps {
  image: string;
  productName: string;
  fadeInVariants: any;
}

// Enhanced image extraction with exact mapping to uploaded images
const getProductImage = (productName: string) => {
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

  return imageMap[productName] || '/placeholder.svg';
};

export const ProductImage = ({ image, productName, fadeInVariants }: ProductImageProps) => {
  // Use the image mapping to get the correct image
  const actualImage = image || getProductImage(productName);
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-anong-cream to-anong-ivory p-12 flex items-center justify-center"
    >
      <img 
        src={actualImage}
        alt={productName}
        className="max-w-[280px] max-h-[280px] w-auto h-auto object-contain"
        loading="eager"
        decoding="async"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
    </motion.div>
  );
};

export default ProductImage;
