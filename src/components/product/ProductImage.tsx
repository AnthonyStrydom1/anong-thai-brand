
import { motion } from 'framer-motion';

interface ProductImageProps {
  image: string;
  productName: string;
  fadeInVariants: any;
}

export const ProductImage = ({ image, productName, fadeInVariants }: ProductImageProps) => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-b from-anong-cream to-anong-ivory p-12 flex items-center justify-center"
    >
      <img 
        src={image}
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
