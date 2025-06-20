
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductTranslations } from './useProductTranslations';
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
    rating: 0, // Start with 0 so users must select a rating
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = useProductTranslations(language);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t.authRequired,
        description: t.signInToReview,
        variant: 'destructive'
      });
      return;
    }

    if (newReview.rating === 0) {
      toast({
        title: t.missingInfo,
        description: 'Please select a rating',
        variant: 'destructive'
      });
      return;
    }

    if (!newReview.title.trim() || !newReview.content.trim()) {
      toast({
        title: t.missingInfo,
        description: t.provideTitleAndContent,
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const customer = await supabaseService.getCurrentUserCustomer();
      
      if (!customer) {
        toast({
          title: t.customerProfileRequired,
          description: t.completeProfile,
          variant: 'destructive'
        });
        return;
      }

      console.log('Submitting review:', {
        product_id: productId,
        customer_id: customer.id,
        rating: newReview.rating,
        title: newReview.title.trim(),
        content: newReview.content.trim()
      });

      const { error } = await supabaseService.supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          customer_id: customer.id,
          rating: newReview.rating,
          title: newReview.title.trim(),
          content: newReview.content.trim(),
          is_approved: false // Reviews now require admin approval
        });

      if (error) {
        console.error('Review submission error:', error);
        throw error;
      }

      console.log('Review submitted successfully');

      toast({
        title: t.reviewSubmitted,
        description: 'Your review has been submitted and is pending approval.',
      });

      setNewReview({ rating: 0, title: '', content: '' });
      onReviewSubmitted();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: t.error,
        description: error.message || t.failedToSubmitReview,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmitReview} className="space-y-4 p-4 border rounded-lg bg-gray-50 mb-6">
      <div>
        <Label>{t.rating} *</Label>
        <div className="mt-1">
          <StarRating
            rating={newReview.rating}
            interactive={true}
            onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
          />
          {newReview.rating === 0 && (
            <p className="text-sm text-gray-500 mt-1">Click on a star to rate this product</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="review-title">{t.reviewTitle} *</Label>
        <Input
          id="review-title"
          value={newReview.title}
          onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
          placeholder={t.reviewTitlePlaceholder}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="review-content">{t.yourReview} *</Label>
        <Textarea
          id="review-content"
          value={newReview.content}
          onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
          placeholder={t.reviewContentPlaceholder}
          rows={4}
          required
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" disabled={isSubmitting || newReview.rating === 0}>
          {isSubmitting ? t.submitting : t.submitReview}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t.cancel}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
