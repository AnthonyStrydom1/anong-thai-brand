
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  currentLanguage: 'en' | 'th';
}

const ProductCard = ({ product, currentLanguage }: ProductCardProps) => {
  const { id, name, shortDescription, price, image } = product;
  
  const translations = {
    en: {
      addToCart: "Add to Cart",
      viewDetails: "View Details"
    },
    th: {
      addToCart: "เพิ่มลงตะกร้า",
      viewDetails: "ดูรายละเอียด"
    }
  };

  const t = translations[currentLanguage];

  return (
    <div className="thai-card group">
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={name[currentLanguage]} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-thai-purple transition">
            {name[currentLanguage]}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {shortDescription[currentLanguage]}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-thai-purple">
            ${price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            className="bg-thai-purple hover:bg-thai-purple-dark"
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
