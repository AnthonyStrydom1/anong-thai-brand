
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
  const { id, name, shortDescription, price, image, category } = product;
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

  // Generate the mockup based on product category
  const renderProductMockup = () => {
    const isJar = category === 'curry-pastes' || category === 'dipping-sauces';
    
    return (
      <div className="h-48 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-2">
        <div className={`relative ${isJar ? 'w-32 h-40' : 'w-24 h-40'} mx-auto`}>
          {/* Mockup container */}
          <div className={`${isJar ? 'rounded-3xl' : 'rounded-lg'} overflow-hidden bg-transparent h-full w-full flex items-center justify-center`}>
            {/* Glass jar/bottle effect */}
            <div className={`absolute inset-0 ${isJar ? 'rounded-3xl' : 'rounded-lg'} bg-black bg-opacity-5 backdrop-blur-sm`}></div>
            
            {/* Product reflection/highlight */}
            <div className={`absolute inset-y-0 left-0 w-1/4 ${isJar ? 'rounded-l-3xl' : 'rounded-l-lg'} bg-white bg-opacity-10`}></div>
            
            {/* Product label */}
            <div className={`absolute inset-0 flex items-center justify-center ${isJar ? 'px-2' : 'px-1'}`}>
              <img 
                src={image} 
                alt={name[language]} 
                className="max-h-[85%] max-w-[85%] object-contain z-10"
              />
            </div>
            
            {/* Jar/bottle lid */}
            <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 ${isJar ? 'w-20 h-3' : 'w-10 h-4'} rounded-t-lg bg-black`}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="thai-card group">
      <Link to={`/product/${id}`} className="block overflow-hidden">
        {renderProductMockup()}
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
