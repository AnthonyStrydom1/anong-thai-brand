
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
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
  const { formatPrice } = useCurrency();
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
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative h-full"
      >
        <div className="bg-white rounded-2xl md:rounded-3xl overflow-hidden relative transition-all duration-500 border border-anong-gold/15 h-full flex flex-col">
          {/* Enhanced shadow system with gold undertones */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl shadow-[0_4px_24px_rgba(26,61,46,0.06),0_8px_40px_rgba(212,165,116,0.04)] group-hover:shadow-[0_8px_40px_rgba(26,61,46,0.08),0_16px_60px_rgba(212,165,116,0.06)] transition-all duration-500"></div>
          
          <Link to={`/product/${id}`} className="block relative z-10">
            <div className="aspect-square bg-gradient-to-br from-anong-cream via-anong-warm-cream/20 to-anong-cream relative overflow-hidden">
              {/* Subtle botanical background with gold tint */}
              <div className="absolute inset-0 bg-botanical-pattern opacity-[0.012]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-anong-gold/[0.008] via-transparent to-anong-gold/[0.004]"></div>
              
              <motion.img 
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                src={image} 
                alt={name[language]}
                className="w-3/4 sm:w-4/5 h-3/4 sm:h-4/5 object-contain absolute inset-0 m-auto drop-shadow-lg"
                loading="lazy"
              />
              
              {/* Premium gold accent overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/[0.015] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>
          
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 relative flex-1 flex flex-col">
            {/* Gold accent line */}
            <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-anong-gold/60 to-transparent mb-2 sm:mb-4"></div>
            
            <Link to={`/product/${id}`} className="flex-1">
              <h3 className="font-elegant text-sm sm:text-lg md:text-xl lg:text-2xl mb-1 sm:mb-2 md:mb-3 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-500 leading-tight font-light line-clamp-2">
                {name[language]}
              </h3>
            </Link>
            
            <p className="text-xs sm:text-sm text-anong-charcoal/65 mb-3 sm:mb-4 md:mb-6 font-light tracking-wide">
              {t.weight}
            </p>
            
            <div className="mt-auto space-y-2 sm:space-y-3 md:space-y-4">
              <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-light text-anong-dark-green text-center">
                {formatPrice(price)}
              </span>
              <Button 
                size="sm" 
                className="w-full bg-anong-black hover:bg-anong-gold hover:text-anong-black text-anong-ivory text-xs sm:text-sm px-3 sm:px-4 md:px-6 py-2 sm:py-3 h-auto font-medium tracking-wide transition-all duration-500 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl border border-anong-black/10 group-hover:scale-105"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative h-full"
    >
      <div className="bg-white overflow-hidden relative rounded-2xl md:rounded-3xl transition-all duration-700 border border-anong-gold/20 h-full flex flex-col">
        {/* Enhanced shadow system with layered depth */}
        <div className="absolute inset-0 rounded-2xl md:rounded-3xl shadow-[0_6_32px_rgba(26,61,46,0.08),0_12px_48px_rgba(212,165,116,0.05),0_24px_80px_rgba(26,61,46,0.03)] group-hover:shadow-[0_12px_48px_rgba(26,61,46,0.12),0_24px_80px_rgba(212,165,116,0.08),0_40px_120px_rgba(26,61,46,0.05)] transition-all duration-700"></div>
        
        <Link to={`/product/${id}`} className="block overflow-hidden relative z-10">
          <div className="h-48 sm:h-56 md:h-64 lg:h-80 overflow-hidden flex items-center justify-center bg-gradient-to-br from-anong-cream via-anong-warm-cream/15 to-anong-cream relative">
            {/* Enhanced botanical background with gold tints */}
            <div className="absolute inset-0 bg-botanical-pattern opacity-[0.015]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-anong-gold/[0.012] via-transparent to-anong-gold/[0.006]"></div>
            
            <motion.img 
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              src={image} 
              alt={name[language]}
              className="w-3/4 sm:w-4/5 h-3/4 sm:h-4/5 object-contain relative z-10 drop-shadow-2xl"
              loading="lazy"
            />
            
            {/* Premium gold hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </Link>
        
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 relative z-10 bg-white flex-1 flex flex-col">
          {/* Decorative gold accent */}
          <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
            <div className="w-8 sm:w-10 md:w-12 lg:w-16 h-px bg-gradient-to-r from-anong-gold/70 to-anong-gold/30"></div>
            <div className="ml-2 sm:ml-3 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-anong-gold/60 rounded-full"></div>
          </div>
          
          <Link to={`/product/${id}`} className="flex-1">
            <h3 className="heading-elegant text-base sm:text-lg md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4 lg:mb-5 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-500 leading-tight font-light line-clamp-2">
              {name[language]}
            </h3>
          </Link>
          
          <p className="text-luxury text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 lg:mb-8 line-clamp-2 text-anong-charcoal/75 leading-relaxed font-light">
            {shortDescription[language]}
          </p>
          
          {/* Enhanced botanical divider */}
          <div className="flex items-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <div className="w-6 sm:w-8 md:w-10 lg:w-12 h-px bg-anong-gold/60"></div>
            <div className="mx-2 sm:mx-3 md:mx-4 botanical-accent w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 opacity-70"></div>
            <div className="flex-1 h-px bg-anong-gold/40"></div>
          </div>
          
          <div className="mt-auto space-y-3 sm:space-y-4">
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-light text-anong-dark-green text-center">
              {formatPrice(price)}
            </span>
            <Button 
              size="sm" 
              className="w-full bg-anong-black hover:bg-anong-gold hover:text-anong-black text-anong-ivory text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 h-auto font-medium tracking-wide transition-all duration-500 rounded-lg sm:rounded-xl shadow-xl hover:shadow-2xl border border-anong-black/15 group-hover:scale-105"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 md:mr-3" />
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
