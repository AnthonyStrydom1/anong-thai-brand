
import React from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductTranslations } from './useProductTranslations';
import StarRating from './StarRating';

interface ReviewItemProps {
  review: {
    id: string;
    rating: number;
    title: string;
    content: string;
    created_at: string;
    product_id: string;
    is_verified_purchase: boolean;
    customer?: {
      fullname: string;
      first_name: string;
      last_name: string;
    };
  };
}

const ReviewItem = ({ review }: ReviewItemProps) => {
  const { language } = useLanguage();
  const t = useProductTranslations(language);
  
  const customerName = review.customer?.fullname || 
    `${review.customer?.first_name || ''} ${review.customer?.last_name || ''}`.trim() || 
    t.anonymous;

  console.log('ReviewItem rendering for product:', review.product_id, 'review:', review.id);

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-400" />
          <span className="font-medium">{customerName}</span>
          {review.is_verified_purchase && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {t.verifiedPurchase}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <div className="mb-2">
        <StarRating rating={review.rating} size="sm" />
      </div>
      
      <h4 className="font-medium mb-1">{review.title}</h4>
      <p className="text-gray-700 text-sm">{review.content}</p>
    </div>
  );
};

export default ReviewItem;
