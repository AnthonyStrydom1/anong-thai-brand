
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
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

  const handleAddToCart = () => {
    addItem(product, 1); // Pass the full SupabaseProduct and quantity
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Get the first image from the images array, or use placeholder
  const productImage = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder.svg';

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
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
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{product.short_description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full"
          disabled={product.stock_quantity === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
