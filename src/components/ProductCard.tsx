
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className="luxury-card group overflow-hidden relative bg-white shadow-[0_8px_40px_rgba(26,61,46,0.08)] hover:shadow-[0_16px_60px_rgba(26,61,46,0.12)] border border-anong-warm-cream/50 rounded-2xl transition-all duration-500">
        {/* Premium badge */}
        <div className="absolute top-6 left-6 z-10">
          <span className="bg-anong-gold text-anong-deep-black px-4 py-2 text-xs font-medium tracking-wider uppercase rounded-full shadow-lg font-elegant">
            Premium
          </span>
        </div>

        <Link to={`/product/${id}`} className="block overflow-hidden">
          <div className="h-80 overflow-hidden flex items-center justify-center bg-gradient-to-br from-anong-cream to-anong-warm-cream relative">
            {/* Subtle botanical background */}
            <div className="absolute inset-0 bg-botanical-pattern opacity-10"></div>
            <motion.img 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              src={image} 
              alt={name[language]}
              className="w-4/5 h-4/5 object-contain relative z-10 drop-shadow-xl"
            />
            {/* Elegant gold accent on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </Link>
        
        <div className="p-8 relative z-10 bg-white">
          <Link to={`/product/${id}`}>
            <h3 className="heading-elegant text-2xl mb-4 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-300 leading-tight font-light">
              {name[language]}
            </h3>
          </Link>
          <p className="text-luxury text-base mb-6 line-clamp-2 text-anong-charcoal/70 leading-relaxed font-light">
            {shortDescription[language]}
          </p>
          
          {/* Refined botanical divider */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-px bg-anong-gold/40"></div>
            <div className="mx-3 botanical-accent w-4 h-4 opacity-50"></div>
            <div className="flex-1 h-px bg-anong-gold/40"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl font-display font-light text-anong-dark-green">
              R{price.toFixed(2)}
            </span>
            <Button 
              size="sm" 
              className="bg-anong-dark-green hover:bg-anong-gold hover:text-anong-deep-black text-anong-cream text-sm px-6 py-3 h-auto font-medium tracking-wide transition-all duration-300 rounded-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t.addToCart}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
