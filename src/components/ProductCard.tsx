
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
      addedToCart: "Added to cart!"
    },
    th: {
      addToCart: "เพิ่มลงตะกร้า",
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className="luxury-card group overflow-hidden relative bg-white shadow-[0_6px_30px_rgba(26,61,46,0.06)] hover:shadow-[0_12px_50px_rgba(26,61,46,0.10)] border border-anong-warm-cream/40 rounded-2xl transition-all duration-700">
        {/* Refined premium badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className="bg-anong-gold text-anong-deep-black px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full shadow-md font-elegant">
            Premium
          </span>
        </div>

        <Link to={`/product/${id}`} className="block overflow-hidden">
          <div className="h-72 overflow-hidden flex items-center justify-center bg-gradient-to-br from-anong-cream to-anong-warm-cream relative">
            {/* Subtle botanical background */}
            <div className="absolute inset-0 bg-botanical-pattern opacity-8"></div>
            <motion.img 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              src={image} 
              alt={name[language]}
              className="w-4/5 h-4/5 object-contain relative z-10 drop-shadow-lg"
            />
            {/* Subtle gold accent on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </Link>
        
        <div className="p-6 relative z-10 bg-white">
          <Link to={`/product/${id}`}>
            <h3 className="heading-elegant text-xl mb-3 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-500 leading-tight font-light">
              {name[language]}
            </h3>
          </Link>
          <p className="text-luxury text-sm mb-6 line-clamp-2 text-anong-charcoal/70 leading-relaxed font-light">
            {shortDescription[language]}
          </p>
          
          {/* Refined botanical divider */}
          <div className="flex items-center mb-6">
            <div className="w-8 h-px bg-anong-gold/30"></div>
            <div className="mx-2 botanical-accent w-3 h-3 opacity-40"></div>
            <div className="flex-1 h-px bg-anong-gold/30"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xl font-display font-light text-anong-dark-green">
              R{price.toFixed(2)}
            </span>
            <Button 
              size="sm" 
              className="bg-anong-dark-green hover:bg-anong-gold hover:text-anong-deep-black text-anong-cream text-xs px-5 py-2 h-auto font-medium tracking-wide transition-all duration-500 rounded-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 mr-2" />
              {t.addToCart}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
