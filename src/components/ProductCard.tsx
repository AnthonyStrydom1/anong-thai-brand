
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
        <div className="h-64 overflow-hidden bg-black flex items-center justify-center p-2">
          {/* Jar mockup */}
          <div className="relative w-full h-full max-w-[200px] mx-auto">
            {/* Glass jar container */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800/80 to-black rounded-lg"
              style={{
                clipPath: 'polygon(25% 0%, 75% 0%, 85% 5%, 85% 95%, 75% 100%, 25% 100%, 15% 95%, 15% 5%)'
              }}>
              {/* Glass reflections */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/10 to-black/0"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent" style={{ height: '20%' }}></div>
              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-white/5 to-transparent" style={{ height: '30%' }}></div>
            </div>
            
            {/* Product label positioned in the center of the jar */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-[70%] h-[70%] overflow-hidden rounded">
                <img 
                  src={image} 
                  alt={name[language]} 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Jar lid */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[50%] h-[8%] bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-md"></div>
            
            {/* Realistic jar reflections */}
            <div className="absolute top-[15%] right-[15%] w-[3%] h-[70%] bg-white opacity-30 rounded-full"></div>
            <div className="absolute top-[25%] left-[20%] w-[2%] h-[50%] bg-white opacity-20 rounded-full"></div>
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
