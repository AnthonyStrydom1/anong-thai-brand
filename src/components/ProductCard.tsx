
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';

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
    <div className="thai-card group">
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <div className="h-64 overflow-hidden bg-black flex items-center justify-center p-2 relative">
          {/* Jar mockup with product label */}
          <div className="relative w-full h-full max-w-[200px] mx-auto">
            {/* Jar/bottle container */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(255,255,255,0.2)] rounded-lg" style={{
              clipPath: 'polygon(20% 0%, 80% 0%, 90% 5%, 90% 95%, 80% 100%, 20% 100%, 10% 95%, 10% 5%)'
            }}></div>
            
            {/* Product image as the label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={image} 
                alt={name[language]} 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            {/* Jar lid */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[60%] h-[10%] bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-lg"></div>
            
            {/* Jar reflections */}
            <div className="absolute top-[15%] right-[15%] w-[5%] h-[70%] bg-white opacity-20 rounded-full"></div>
            <div className="absolute top-[20%] left-[15%] w-[3%] h-[60%] bg-white opacity-10 rounded-full"></div>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-thai-purple transition">
            {name[language]}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {shortDescription[language]}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-thai-purple">
            ${price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            className="bg-thai-purple hover:bg-thai-purple-dark"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {t.addToCart}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
