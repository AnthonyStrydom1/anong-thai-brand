
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

  // Get the first image from the images array, handle different data formats
  const getProductImage = () => {
    console.log("Product images:", product.images, typeof product.images);
    
    if (product.images) {
      // If it's already an array
      if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0];
      }
      
      // If it's a string that might be JSON
      if (typeof product.images === 'string') {
        try {
          const parsed = JSON.parse(product.images);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed[0];
          }
          // If it's just a string URL
          return product.images;
        } catch {
          // If JSON parsing fails, treat as direct URL
          return product.images;
        }
      }
      
      // If it's an object (jsonb), try to extract first value
      if (typeof product.images === 'object' && product.images !== null) {
        const values = Object.values(product.images);
        if (values.length > 0 && typeof values[0] === 'string') {
          return values[0];
        }
      }
    }
    
    return '/placeholder.svg';
  };

  const productImage = getProductImage();
  console.log("Final product image URL:", productImage);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              console.log("Image failed to load:", productImage);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
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
          className="w-full bg-anong-black text-white hover:bg-anong-gold hover:text-anong-black transition-colors"
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
