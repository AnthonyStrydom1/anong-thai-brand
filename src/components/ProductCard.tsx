
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import ProductJarMockup from './product/ProductJarMockup';

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
          <ProductJarMockup 
            image={image}
            altText={name[language]}
          />
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
