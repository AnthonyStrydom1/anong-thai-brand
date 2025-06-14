
import React from 'react';
import ReviewItem from './ReviewItem';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  customer_id: number;
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
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
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
