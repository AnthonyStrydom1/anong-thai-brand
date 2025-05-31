
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
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative"
      >
        <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(26,61,46,0.06)] hover:shadow-[0_8px_40px_rgba(26,61,46,0.12)] border border-anong-warm-cream/30 overflow-hidden transition-all duration-600">
          <Link to={`/product/${id}`} className="block">
            <div className="aspect-square bg-gradient-to-br from-anong-cream via-anong-warm-cream/20 to-anong-cream relative overflow-hidden">
              {/* Refined botanical background */}
              <div className="absolute inset-0 bg-botanical-pattern opacity-[0.01]"></div>
              
              <motion.img 
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                src={image} 
                alt={name[language]}
                className="w-4/5 h-4/5 object-contain absolute inset-0 m-auto drop-shadow-md"
                loading="lazy"
              />
              
              {/* Subtle premium overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
            </div>
          </Link>
          
          <div className="p-6 md:p-8">
            <Link to={`/product/${id}`}>
              <h3 className="font-elegant text-xl md:text-2xl mb-3 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-500 leading-tight font-medium">
                {name[language]}
              </h3>
            </Link>
            
            <p className="text-sm md:text-base text-anong-charcoal/60 mb-6 font-light">
              {t.weight}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-2xl md:text-3xl font-display font-light text-anong-dark-green">
                R{price.toFixed(2)}
              </span>
              <Button 
                size="sm" 
                className="bg-anong-dark-green hover:bg-anong-gold hover:text-anong-deep-black text-anong-cream text-sm md:text-base px-6 md:px-8 py-3 md:py-4 h-auto font-medium tracking-wide transition-all duration-500 rounded-xl group-hover:shadow-lg min-h-[48px]"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2 md:mr-3" />
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      <div className="luxury-card group overflow-hidden relative bg-white shadow-[0_8px_35px_rgba(26,61,46,0.08)] hover:shadow-[0_12px_60px_rgba(26,61,46,0.12)] border border-anong-warm-cream/30 rounded-3xl transition-all duration-700">
        {/* Premium badge */}
        <div className="absolute top-6 md:top-8 left-6 md:left-8 z-10">
          <span className="bg-anong-gold text-anong-deep-black px-4 md:px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-full shadow-lg font-elegant">
            Premium
          </span>
        </div>

        <Link to={`/product/${id}`} className="block overflow-hidden">
          <div className="h-72 md:h-96 overflow-hidden flex items-center justify-center bg-gradient-to-br from-anong-cream via-anong-warm-cream/15 to-anong-cream relative">
            {/* Refined botanical background */}
            <div className="absolute inset-0 bg-botanical-pattern opacity-[0.015]"></div>
            <motion.img 
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              src={image} 
              alt={name[language]}
              className="w-4/5 h-4/5 object-contain relative z-10 drop-shadow-xl"
              loading="lazy"
            />
            {/* Premium hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </Link>
        
        <div className="p-8 md:p-10 relative z-10 bg-white">
          <Link to={`/product/${id}`}>
            <h3 className="heading-elegant text-2xl md:text-3xl mb-4 md:mb-5 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-600 leading-tight font-light">
              {name[language]}
            </h3>
          </Link>
          <p className="text-luxury text-base md:text-lg mb-8 md:mb-10 line-clamp-2 text-anong-charcoal/70 leading-relaxed font-light">
            {shortDescription[language]}
          </p>
          
          {/* Elegant botanical divider */}
          <div className="flex items-center mb-8 md:mb-10">
            <div className="w-10 md:w-12 h-px bg-anong-gold/50"></div>
            <div className="mx-4 botanical-accent w-4 md:w-5 h-4 md:h-5 opacity-60"></div>
            <div className="flex-1 h-px bg-anong-gold/50"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-2xl md:text-3xl font-display font-light text-anong-dark-green">
              R{price.toFixed(2)}
            </span>
            <Button 
              size="sm" 
              className="bg-anong-dark-green hover:bg-anong-gold hover:text-anong-deep-black text-anong-cream text-base px-8 md:px-10 py-4 md:py-5 h-auto font-medium tracking-wide transition-all duration-600 rounded-xl min-h-[52px]"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-3" />
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
