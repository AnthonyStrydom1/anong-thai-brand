
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { useProductTranslations } from './useProductTranslations';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

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

interface ProductRatingsProps {
  productId: string;
}

const ProductRatings = ({ productId }: ProductRatingsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = useProductTranslations(language);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      console.log('Loading reviews for product:', productId);
      
      const { data, error } = await supabaseService.supabase
        .from('product_reviews')
        .select(`
          *,
          customers (
            fullname,
            first_name,
            last_name
          )
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Reviews query error:', error);
        throw error;
      }
      
      console.log('Reviews loaded:', data);
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: t.error,
        description: t.failedToLoadReviews,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setShowAddReview(false);
    loadReviews();
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t.customerReviews}</span>
            {user && (
              <Button 
                onClick={() => setShowAddReview(!showAddReview)}
                variant="outline"
                size="sm"
              >
                {showAddReview ? t.cancel : t.writeReview}
              </Button>
            )}
          </CardTitle>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <StarRating rating={Math.round(averageRating)} />
              <span>{averageRating.toFixed(1)} {t.outOf5}</span>
              <span>({reviews.length} {reviews.length !== 1 ? t.reviews : t.review})</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {showAddReview && (
            <ReviewForm
              productId={productId}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={() => setShowAddReview(false)}
            />
          )}
          <ReviewList reviews={reviews} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductRatings;
