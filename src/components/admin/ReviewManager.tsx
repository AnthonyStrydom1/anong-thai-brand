
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabaseService } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';
import { Star, CheckCircle, XCircle, Eye, User } from 'lucide-react';
import StarRating from '@/components/product/StarRating';

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

  const renderReviewsTable = (reviewsList: Review[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Content</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviewsList.map((review) => {
          const customerName = review.customer?.fullname || 
            `${review.customer?.first_name || ''} ${review.customer?.last_name || ''}`.trim() || 
            'Anonymous';

          return (
            <TableRow key={review.id}>
              <TableCell className="font-medium">
                {review.products?.name || 'Unknown Product'}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{customerName}</div>
                    <div className="text-sm text-gray-500">{review.customer?.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StarRating rating={review.rating} size="sm" />
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div className="truncate font-medium">{review.title}</div>
              </TableCell>
              <TableCell className="max-w-[300px]">
                <div className="truncate text-sm text-gray-600">{review.content}</div>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {!review.is_approved ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(review.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(review.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

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
              {pendingReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No pending reviews</p>
                </div>
              ) : (
                renderReviewsTable(pendingReviews)
              )}
            </TabsContent>

            <TabsContent value="approved">
              {approvedReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No approved reviews</p>
                </div>
              ) : (
                renderReviewsTable(approvedReviews)
              )}
            </TabsContent>

            <TabsContent value="all">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No reviews found</p>
                </div>
              ) : (
                renderReviewsTable(reviews)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewManager;
