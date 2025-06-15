
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductTranslations } from './useProductTranslations';
import ReviewItem from './ReviewItem';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  customer_id: number;
  product_id: string;
  is_verified_purchase: boolean;
  customer?: {
    fullname: string;
    first_name: string;
    last_name: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList = ({ reviews }: ReviewListProps) => {
  const { language } = useLanguage();
  const t = useProductTranslations(language);

  console.log('ReviewList rendering with', reviews.length, 'reviews');
  console.log('Review product IDs:', reviews.map(r => r.product_id));

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{t.noReviews}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
