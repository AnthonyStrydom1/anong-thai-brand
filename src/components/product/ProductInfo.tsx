
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/types';
import StarRating from './StarRating';

interface ProductInfoProps {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
  isLoadingReviews?: boolean;
}

const ProductInfo = ({ product, averageRating = 0, reviewCount = 0, isLoadingReviews = false }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { language } = useLanguage();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name[language],
      price: product.price,
      image: product.image,
      quantity: quantity
    });
    
    toast({
      title: language === 'en' ? "Added to cart" : "เพิ่มในตะกร้า",
      description: language === 'en' 
        ? `${quantity} ${product.name[language]} added to your cart`
        : `เพิ่ม ${quantity} ${product.name[language]} ในตะกร้าแล้ว`
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name[language],
        text: product.description[language],
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: language === 'en' ? "Link copied" : "คัดลอกลิงก์แล้ว",
        description: language === 'en' ? "Product link copied to clipboard" : "คัดลอกลิงก์สินค้าแล้ว"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name[language]}</h1>
        <p className="text-gray-600 text-lg">{product.description[language]}</p>
      </div>

      {/* Rating Section - Only show if we have reviews or if loading is complete */}
      {!isLoadingReviews && (
        <div className="flex items-center space-x-3">
          {reviewCount > 0 ? (
            <>
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">
              {language === 'en' ? 'Be the first to review' : 'เป็นคนแรกที่รีวิว'}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-thai-purple">{formatPrice(product.price)}</span>
        {product.comparePrice && (
          <span className="text-lg text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
        )}
      </div>

      {product.featured && (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          {language === 'en' ? 'Featured' : 'แนะนำ'}
        </Badge>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="text-sm font-medium">
            {language === 'en' ? 'Quantity:' : 'จำนวน:'}
          </label>
          <select
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-thai-purple hover:bg-thai-purple/90"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Add to Cart' : 'เพิ่มในตะกร้า'}
          </Button>
          
          <Button variant="outline" size="lg">
            <Heart className="w-5 h-5" />
          </Button>
          
          <Button variant="outline" size="lg" onClick={handleShare}>
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="border-t pt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{language === 'en' ? 'SKU:' : 'รหัสสินค้า:'}</span>
          <span>{product.sku}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{language === 'en' ? 'Category:' : 'หมวดหมู่:'}</span>
          <span>{product.category[language]}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{language === 'en' ? 'Availability:' : 'สถานะสินค้า:'}</span>
          <span className="text-green-600">{language === 'en' ? 'In Stock' : 'มีสินค้า'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
