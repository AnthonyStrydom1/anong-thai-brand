
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "@/components/ui/use-toast";

interface ProductInfoProps {
  product: Product;
  language: 'en' | 'th';
  translations: {
    addToCart: string;
    quantity: string;
    addedToCart: string;
  };
}

export const ProductInfo = ({ product, language, translations }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  
  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: translations.addedToCart,
      description: `${product.name[language]} x ${quantity}`,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        {product.name[language]}
      </h1>
      <p className="text-2xl font-semibold text-thai-purple mb-6">
        {formatPrice(product.price)}
      </p>
      
      <p className="text-gray-700 mb-6">
        {product.shortDescription[language]}
      </p>
      
      {/* Quantity Selector */}
      <div className="mb-8">
        <p className="text-gray-700 mb-2">{translations.quantity}</p>
        <div className="flex border border-gray-300 rounded-md w-32">
          <button 
            onClick={decreaseQuantity}
            className="px-3 py-1 border-r border-gray-300"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="w-full text-center focus:outline-none"
          />
          <button 
            onClick={increaseQuantity}
            className="px-3 py-1 border-l border-gray-300"
          >
            +
          </button>
        </div>
      </div>
      
      {/* Add to Cart */}
      <Button
        onClick={handleAddToCart}
        size="lg"
        className="hover:bg-thai-purple-dark hover:bg-opacity-90"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {translations.addToCart}
      </Button>
    </div>
  );
};
