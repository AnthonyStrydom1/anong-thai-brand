
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
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="group relative"
      >
        <div className="bg-white rounded-3xl md:rounded-4xl overflow-hidden relative transition-all duration-600 border border-anong-gold/15">
          {/* Enhanced shadow system with gold undertones */}
          <div className="absolute inset-0 rounded-3xl md:rounded-4xl shadow-[0_4px_24px_rgba(26,61,46,0.06),0_8px_40px_rgba(212,165,116,0.04)] group-hover:shadow-[0_8px_40px_rgba(26,61,46,0.08),0_16px_60px_rgba(212,165,116,0.06)] transition-all duration-600"></div>
          
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
                className="w-4/5 h-4/5 object-contain absolute inset-0 m-auto drop-shadow-lg"
                loading="lazy"
              />
              
              {/* Premium gold accent overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/[0.015] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
            </div>
          </Link>
          
          <div className="p-8 md:p-10 relative">
            {/* Gold accent line */}
            <div className="w-12 h-px bg-gradient-to-r from-anong-gold/60 to-transparent mb-6"></div>
            
            <Link to={`/product/${id}`}>
              <h3 className="font-elegant text-2xl md:text-3xl mb-4 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-500 leading-tight font-light">
                {name[language]}
              </h3>
            </Link>
            
            <p className="text-sm md:text-base text-anong-charcoal/65 mb-8 font-light tracking-wide">
              {t.weight}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-3xl md:text-4xl font-display font-light text-anong-dark-green">
                R{price.toFixed(2)}
              </span>
              <Button 
                size="sm" 
                className="bg-anong-dark-green hover:bg-anong-gold hover:text-anong-deep-black text-anong-cream text-sm md:text-base px-8 md:px-10 py-4 md:py-5 h-auto font-medium tracking-wide transition-all duration-500 rounded-2xl shadow-lg hover:shadow-xl border border-anong-dark-green/10 min-h-[52px] group-hover:scale-105"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-3 md:mr-4" />
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
      className="group relative"
    >
      <div className="bg-white overflow-hidden relative rounded-3xl md:rounded-4xl transition-all duration-700 border border-anong-gold/20">
        {/* Enhanced shadow system with layered depth */}
        <div className="absolute inset-0 rounded-3xl md:rounded-4xl shadow-[0_6_32px_rgba(26,61,46,0.08),0_12px_48px_rgba(212,165,116,0.05),0_24px_80px_rgba(26,61,46,0.03)] group-hover:shadow-[0_12px_48px_rgba(26,61,46,0.12),0_24px_80px_rgba(212,165,116,0.08),0_40px_120px_rgba(26,61,46,0.05)] transition-all duration-700"></div>
        
        {/* Premium badge with gold accent */}
        <div className="absolute top-8 md:top-10 left-8 md:left-10 z-20">
          <span className="bg-gradient-to-r from-anong-gold to-anong-warm-gold text-anong-deep-black px-6 md:px-7 py-3 text-xs font-medium tracking-wider uppercase rounded-full shadow-lg font-elegant border border-anong-gold/20">
            Premium
          </span>
        </div>

        <Link to={`/product/${id}`} className="block overflow-hidden relative z-10">
          <div className="h-80 md:h-[26rem] overflow-hidden flex items-center justify-center bg-gradient-to-br from-anong-cream via-anong-warm-cream/15 to-anong-cream relative">
            {/* Enhanced botanical background with gold tints */}
            <div className="absolute inset-0 bg-botanical-pattern opacity-[0.015]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-anong-gold/[0.012] via-transparent to-anong-gold/[0.006]"></div>
            
            <motion.img 
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              src={image} 
              alt={name[language]}
              className="w-4/5 h-4/5 object-contain relative z-10 drop-shadow-2xl"
              loading="lazy"
            />
            
            {/* Premium gold hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-anong-gold/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </Link>
        
        <div className="p-10 md:p-12 relative z-10 bg-white">
          {/* Decorative gold accent */}
          <div className="flex items-center mb-6">
            <div className="w-16 md:w-20 h-px bg-gradient-to-r from-anong-gold/70 to-anong-gold/30"></div>
            <div className="ml-4 w-2 h-2 bg-anong-gold/60 rounded-full"></div>
          </div>
          
          <Link to={`/product/${id}`}>
            <h3 className="heading-elegant text-3xl md:text-4xl mb-6 md:mb-7 text-anong-deep-black group-hover:text-anong-dark-green transition-colors duration-600 leading-tight font-light">
              {name[language]}
            </h3>
          </Link>
          
          <p className="text-luxury text-lg md:text-xl mb-10 md:mb-12 line-clamp-2 text-anong-charcoal/75 leading-relaxed font-light">
            {shortDescription[language]}
          </p>
          
          {/* Enhanced botanical divider */}
          <div className="flex items-center mb-10 md:mb-12">
            <div className="w-14 md:w-16 h-px bg-anong-gold/60"></div>
            <div className="mx-6 botanical-accent w-5 md:w-6 h-5 md:h-6 opacity-70"></div>
            <div className="flex-1 h-px bg-anong-gold/40"></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-3xl md:text-4xl font-display font-light text-anong-dark-green">
              R{price.toFixed(2)}
            </span>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-anong-dark-green to-anong-forest hover:from-anong-gold hover:to-anong-warm-gold hover:text-anong-deep-black text-anong-cream text-base md:text-lg px-10 md:px-12 py-5 md:py-6 h-auto font-medium tracking-wide transition-all duration-600 rounded-2xl shadow-xl hover:shadow-2xl border border-anong-dark-green/15 min-h-[56px] group-hover:scale-105"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-4" />
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
