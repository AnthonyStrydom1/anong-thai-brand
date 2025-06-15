
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';

interface UseProductRatingReturn {
  averageRating: number;
  reviewCount: number;
  isLoading: boolean;
}

export const useProductRating = (productId: string): UseProductRatingReturn => {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabaseService.supabase
          .from('product_reviews')
          .select('rating')
          .eq('product_id', productId)
          .eq('is_approved', true);

        if (error) {
          console.error('Error fetching product rating:', error);
          return;
        }

        if (data && data.length > 0) {
          const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = totalRating / data.length;
          
          setAverageRating(avgRating);
          setReviewCount(data.length);
        } else {
          setAverageRating(0);
          setReviewCount(0);
        }
      } catch (error) {
        console.error('Error fetching product rating:', error);
        setAverageRating(0);
        setReviewCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchRating();
    }
  }, [productId]);

  return { averageRating, reviewCount, isLoading };
};
