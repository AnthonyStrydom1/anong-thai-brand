
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SupabaseProduct } from '@/services/supabaseService';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: SupabaseProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Enhanced image extraction with exact mapping to uploaded images
  const getProductImage = () => {
    const imageMap: { [key: string]: string } = {
      'Pad Thai Sauce': '/lovable-uploads/5a0dec88-a26c-4e29-bda6-8d921887615e.png',
      'Sukiyaki Dipping Sauce': '/lovable-uploads/a7096f1f-006f-4264-879e-539ad029747a.png',
      'Tom Yum Chili Paste': '/lovable-uploads/fc66a288-b44b-4bf4-a82f-a2c844b58979.png',
      'Red Curry Paste': '/lovable-uploads/dbb561f8-a97a-447c-8946-5a1d279bed05.png',
      'Panang Curry Paste': '/lovable-uploads/5308a5d2-4f12-42ed-b3f8-f2aa5d7fbac9.png',
      'Massaman Curry Paste': '/lovable-uploads/c936ed96-2c61-4919-9e6d-14f740c80b80.png',
      'Green Curry Paste': '/lovable-uploads/1ae4d3c5-e136-4ed4-9a71-f1e9d6123a83.png',
      'Yellow Curry Paste': '/lovable-uploads/acf32ec1-9435-4a5c-8baf-1943b85b93bf.png'
    };

    return imageMap[product.name] || '/placeholder.svg';
  };

  const productImage = getProductImage();

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <div className="w-full h-64 bg-gradient-to-b from-anong-cream to-anong-ivory flex items-center justify-center p-6">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              style={{ 
                maxWidth: '80%', 
                maxHeight: '80%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              Featured
            </Badge>
          )}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              Low Stock
            </Badge>
          )}
          {product.stock_quantity === 0 && (
            <Badge variant="secondary" className="absolute top-3 right-3">
              Out of Stock
            </Badge>
          )}
        </div>
        
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-anong-deep-green transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{product.short_description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-anong-deep-green">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">4.8</span>
            </div>
          </div>
        </CardContent>
      </Link>
      
      <div className="px-6 pb-6">
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-anong-black text-white hover:bg-gradient-to-r hover:from-anong-black hover:to-anong-gold hover:text-anong-black transition-all duration-300"
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
