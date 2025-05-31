
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="luxury-card group overflow-hidden relative"
    >
      {/* Premium badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-anong-gold text-anong-deep-black px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full shadow-lg">
          Premium
        </span>
      </div>

      <Link to={`/product/${id}`} className="block overflow-hidden">
        <div className="h-72 overflow-hidden flex items-center justify-center bg-gradient-to-br from-anong-cream to-anong-warm-cream relative">
          {/* Subtle botanical background */}
          <div className="absolute inset-0 bg-botanical-pattern opacity-10"></div>
          <motion.img 
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            src={image} 
            alt={name[language]}
            className="w-4/5 h-4/5 object-contain relative z-10 drop-shadow-lg"
          />
          {/* Elegant overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-anong-dark-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      
      <div className="p-6 relative z-10 bg-white">
        <Link to={`/product/${id}`}>
          <h3 className="heading-elegant text-xl mb-3 text-anong-deep-black group-hover:text-anong-dark-green transition-colors leading-tight">
            {name[language]}
          </h3>
        </Link>
        <p className="text-luxury text-sm mb-5 line-clamp-2 text-anong-charcoal/70 leading-relaxed">
          {shortDescription[language]}
        </p>
        
        {/* Botanical divider */}
        <div className="flex items-center mb-4">
          <div className="w-8 h-px bg-anong-gold/60"></div>
          <div className="mx-2 botanical-accent w-3 h-3 opacity-60"></div>
          <div className="flex-1 h-px bg-anong-gold/60"></div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-display font-semibold text-anong-dark-green">
            R{price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            className="btn-outline-premium text-sm px-6 py-2 h-auto group-hover:bg-anong-dark-green group-hover:text-anong-cream"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t.addToCart}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
