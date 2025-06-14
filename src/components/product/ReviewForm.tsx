
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import StarRating from './StarRating';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
  onCancel: () => void;
}

interface NewReviewData {
  rating: number;
  title: string;
  content: string;
}

const ReviewForm = ({ productId, onReviewSubmitted, onCancel }: ReviewFormProps) => {
  const [newReview, setNewReview] = useState<NewReviewData>({
    rating: 5,
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

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
          is_approved: false
        });

      if (error) throw error;

      toast({
        title: 'Review Submitted!',
        description: 'Your review has been submitted and is pending approval.',
      });

      setNewReview({ rating: 5, title: '', content: '' });
      onReviewSubmitted();
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

  return (
    <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border rounded-lg bg-gray-50 mb-6">
      <div>
        <Label>Rating</Label>
        <div className="mt-1">
          <StarRating
            rating={newReview.rating}
            interactive={true}
            onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
          />
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
