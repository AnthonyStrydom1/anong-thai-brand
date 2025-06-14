
import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

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
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
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

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to leave a review',
        variant: 'destructive'
      });
      return;
    }

    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both a title and review content',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get customer record for the current user
      const customer = await supabaseService.getCurrentUserCustomer();
      
      if (!customer) {
        toast({
          title: 'Customer Profile Required',
          description: 'Please complete your profile to leave a review',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabaseService.supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          customer_id: customer.id,
          rating: newReview.rating,
          title: newReview.title.trim(),
          content: newReview.content.trim(),
          is_approved: false // Reviews need approval
        });

      if (error) throw error;

      toast({
        title: 'Review Submitted!',
        description: 'Your review has been submitted and is pending approval.',
      });

      setNewReview({ rating: 5, title: '', content: '' });
      setShowAddReview(false);
      loadReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
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
            <span>Customer Reviews</span>
            {user && (
              <Button 
                onClick={() => setShowAddReview(!showAddReview)}
                variant="outline"
                size="sm"
              >
                {showAddReview ? 'Cancel' : 'Write a Review'}
              </Button>
            )}
          </CardTitle>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {renderStars(Math.round(averageRating))}
              <span>{averageRating.toFixed(1)} out of 5</span>
              <span>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {showAddReview && (
            <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border rounded-lg bg-gray-50 mb-6">
              <div>
                <Label>Rating</Label>
                <div className="mt-1">
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="review-title">Review Title</Label>
                <Input
                  id="review-title"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your review"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="review-content">Your Review</Label>
                <Textarea
                  id="review-content"
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your experience with this product"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddReview(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">
                        {review.customer?.fullname || 
                         `${review.customer?.first_name || ''} ${review.customer?.last_name || ''}`.trim() || 
                         'Anonymous'}
                      </span>
                      {review.is_verified_purchase && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    {renderStars(review.rating)}
                  </div>
                  
                  <h4 className="font-medium mb-1">{review.title}</h4>
                  <p className="text-gray-700 text-sm">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductRatings;
