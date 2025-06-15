
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';
import { Star, CheckCircle, XCircle, User } from 'lucide-react';
import StarRating from '@/components/product/StarRating';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  customer_id: number;
  product_id: string;
  is_approved: boolean;
  is_verified_purchase: boolean;
  customer?: {
    fullname: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  products?: {
    name: string;
  };
}

const ReviewManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const isMobile = useIsMobile();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      console.log('Loading reviews for admin...');
      
      const { data, error } = await supabaseService.supabase
        .from('product_reviews')
        .select(`
          *,
          customers (
            fullname,
            first_name,
            last_name,
            email
          ),
          products (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Reviews query error:', error);
        throw error;
      }
      
      console.log('Admin reviews loaded:', data);
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

  const handleApprove = async (reviewId: string) => {
    try {
      const { error } = await supabaseService.supabase
        .from('product_reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review approved successfully'
      });

      loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve review',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const { error } = await supabaseService.supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review rejected and removed'
      });

      loadReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject review',
        variant: 'destructive'
      });
    }
  };

  const pendingReviews = reviews.filter(r => !r.is_approved);
  const approvedReviews = reviews.filter(r => r.is_approved);

  const ReviewCard = ({ review }: { review: Review }) => {
    const customerName = review.customer?.fullname || 
      `${review.customer?.first_name || ''} ${review.customer?.last_name || ''}`.trim() || 
      'Anonymous';

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium text-sm">{customerName}</div>
                  <div className="text-xs text-gray-500">{review.customer?.email}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>

            <div>
              <div className="font-medium text-sm mb-1">{review.products?.name || 'Unknown Product'}</div>
              <StarRating rating={review.rating} size="sm" />
            </div>

            <div>
              <div className="font-medium text-sm mb-1">{review.title}</div>
              <p className="text-sm text-gray-600">{review.content}</p>
            </div>

            {!review.is_approved ? (
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(review.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(review.id)}
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            ) : (
              <Badge variant="outline" className="text-green-600 w-fit">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderReviewsList = (reviewsList: Review[]) => {
    if (reviewsList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No reviews found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reviewsList.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  };

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
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Review Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{pendingReviews.length}</div>
                <div className="text-sm text-gray-600">Pending Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{approvedReviews.length}</div>
                <div className="text-sm text-gray-600">Approved Reviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">
                Pending ({pendingReviews.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedReviews.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {renderReviewsList(pendingReviews)}
            </TabsContent>

            <TabsContent value="approved">
              {renderReviewsList(approvedReviews)}
            </TabsContent>

            <TabsContent value="all">
              {renderReviewsList(reviews)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewManager;
