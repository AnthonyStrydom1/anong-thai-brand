
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
  isSimplified?: boolean;
}

const ProductCard = ({ product, isSimplified = false }: ProductCardProps) => {
  const { id, name, shortDescription, price, image } = product;
  const { addItem } = useCart();
  const { language } = useLanguage();
  
  const translations = {
    en: {
      addToCart: "Add to Cart",
      addedToCart: "Added to cart!",
      weight: "200g"
    },
    th: {
      addToCart: "เพิ่มลงตะกร้า",
      addedToCart: "เพิ่มลงตะกร้าแล้ว!",
      weight: "200 กรัม"
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

  if (isSimplified) {
    return (
      <motion.div 
        whileHover={{ y: -1 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative"
      >
        <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(26,61,46,0.06)] hover:shadow-[0_4px_25px_rgba(26,61,46,0.10)] border border-anong-gold/8 overflow-hidden transition-all duration-400">
          <Link to={`/product/${id}`} className="block">
            <div className="aspect-square bg-gradient-to-br from-anong-cream to-anong-warm-cream/20 relative overflow-hidden">
              {/* Subtle botanical background */}
              <div className="absolute inset-0 bg-botanical-pattern opacity-4"></div>
              
              <motion.img 
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                src={image} 
                alt={name[language]}
                className="w-3/4 h-3/4 object-contain absolute inset-0 m-auto drop-shadow-sm"
              />
              
              {/* Subtle gold accent on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
            </div>
          </Link>
          
          <div className="p-4 md:p-5">
            <Link to={`/product/${id}`}>
              <h3 className="font-elegant text-base md:text-lg mb-2 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-300 leading-tight font-medium">
                {name[language]}
              </h3>
            </Link>
            
            <p className="text-xs text-anong-charcoal/60 mb-3 md:mb-4 font-light">
              {t.weight}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-display font-medium text-anong-gold">
                R{price.toFixed(2)}
              </span>
              <Button 
                size="sm" 
                className="bg-anong-dark-green hover:bg-anong-gold hover:text-anong-deep-black text-anong-cream text-xs px-3 md:px-4 py-2 h-auto font-medium tracking-wide transition-all duration-300 rounded-lg group-hover:shadow-sm"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3 mr-1 md:mr-1.5" />
                <span className="hidden sm:inline">{t.addToCart}</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className="luxury-card group overflow-hidden relative bg-white shadow-[0_4px_25px_rgba(26,61,46,0.04)] hover:shadow-[0_8px_40px_rgba(26,61,46,0.08)] border border-anong-warm-cream/30 rounded-2xl transition-all duration-500">
        {/* Premium badge */}
        <div className="absolute top-4 md:top-5 left-4 md:left-5 z-10">
          <span className="bg-anong-gold text-anong-deep-black px-2 md:px-3 py-1 text-xs font-medium tracking-wider uppercase rounded-full shadow-md font-elegant">
            Premium
          </span>
        </div>

        <Link to={`/product/${id}`} className="block overflow-hidden">
          <div className="h-60 md:h-72 overflow-hidden flex items-center justify-center bg-gradient-to-br from-anong-cream to-anong-warm-cream relative">
            {/* Subtle botanical background */}
            <div className="absolute inset-0 bg-botanical-pattern opacity-6"></div>
            <motion.img 
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              src={image} 
              alt={name[language]}
              className="w-4/5 h-4/5 object-contain relative z-10 drop-shadow-lg"
            />
            {/* Subtle gold accent on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </Link>
        
        <div className="p-5 md:p-6 relative z-10 bg-white">
          <Link to={`/product/${id}`}>
            <h3 className="heading-elegant text-lg md:text-xl mb-2 md:mb-3 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-400 leading-tight font-light">
              {name[language]}
            </h3>
          </Link>
          <p className="text-luxury text-sm mb-4 md:mb-6 line-clamp-2 text-anong-charcoal/70 leading-relaxed font-light">
            {shortDescription[language]}
          </p>
          
          {/* Refined botanical divider */}
          <div className="flex items-center mb-4 md:mb-6">
            <div className="w-6 md:w-8 h-px bg-anong-gold/30"></div>
            <div className="mx-2 botanical-accent w-2.5 md:w-3 h-2.5 md:h-3 opacity-40"></div>
            <div className="flex-1 h-px bg-anong-gold/30"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-lg md:text-xl font-display font-light text-anong-dark-green">
              R{price.toFixed(2)}
            </span>
            <Button 
              size="sm" 
              className="bg-anong-dark-green hover:bg-anong-gold hover:text-anong-deep-black text-anong-cream text-xs px-4 md:px-5 py-2 h-auto font-medium tracking-wide transition-all duration-400 rounded-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 mr-1.5 md:mr-2" />
              <span className="hidden sm:inline">{t.addToCart}</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
