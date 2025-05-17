
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, shortDescription, price, image } = product;
  const { addItem } = useCart();
  const { language } = useLanguage();
  
  const translations = {
    en: {
      addToCart: "Add to Cart",
      viewDetails: "View Details",
      addedToCart: "Added to cart!"
    },
    th: {
      addToCart: "เพิ่มลงตะกร้า",
      viewDetails: "ดูรายละเอียด",
      addedToCart: "เพิ่มลงตะกร้าแล้ว!"
    }
  };

  const t = translations[language];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: t.addedToCart,
      description: `${name[language]} x 1`,
    });
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="premium-card group overflow-hidden"
    >
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <div className="h-64 overflow-hidden flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={image} 
            alt={name[language]}
            className="w-full h-full object-contain p-4"
          />
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1.5 hover:text-thai-purple transition group-hover:text-thai-purple">
            {name[language]}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {shortDescription[language]}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-thai-purple">
            R{price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            className="bg-white border border-thai-purple text-thai-purple hover:bg-thai-purple hover:text-white transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {t.addToCart}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
