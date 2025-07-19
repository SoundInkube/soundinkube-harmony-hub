import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  Star, 
  Trash2, 
  Eye,
  Clock,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from '@/hooks/use-toast';

export function ReviewManagement() {
  const { getTableData, deleteTableRow, updateTableRow } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await getTableData('reviews');
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive",
        });
      } else {
        setReviews(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteReview = async (id: string) => {
    const { error } = await deleteTableRow('reviews', id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
      loadReviews();
    }
  };

  const handleFlagReview = async (id: string, flagged: boolean) => {
    const { error } = await updateTableRow('reviews', id, { flagged });
    if (error) {
      toast({
        title: "Error",
        description: `Failed to ${flagged ? 'flag' : 'unflag'} review`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Review ${flagged ? 'flagged' : 'unflagged'} successfully`,
      });
      loadReviews();
    }
  };

  const filteredReviews = reviews.filter((review: any) =>
    review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const getReviewStatus = (review: any) => {
    if (review.flagged) return { variant: 'destructive', label: 'Flagged' };
    if (review.verified) return { variant: 'default', label: 'Verified' };
    return { variant: 'secondary', label: 'Pending' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Review Management</h2>
            <p className="text-muted-foreground">Monitor and moderate user reviews</p>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-4 w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Review Management</h2>
          <p className="text-muted-foreground">Monitor and moderate user reviews</p>
        </div>
        <Button onClick={loadReviews}>
          Refresh Data
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review: any) => {
          const status = getReviewStatus(review);
          return (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {review.reviewer_profile?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{review.reviewer_profile?.full_name || 'Anonymous'}</p>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <Badge variant={status.variant as any}>
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Review for {review.reviewee_profile?.full_name || 'Unknown User'}
                        </p>
                      </div>
                    </div>
                    
                    {review.title && (
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                    )}
                    
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {review.content || 'No content provided'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(review.created_at).toLocaleString()}
                      </div>
                      {review.booking_id && (
                        <Badge variant="outline">
                          Booking Review
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>

                    {!review.flagged ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-orange-600"
                        onClick={() => handleFlagReview(review.id, true)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600"
                        onClick={() => handleFlagReview(review.id, false)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReview(review.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            {searchTerm ? "No reviews match your search." : "No reviews found."}
          </p>
        </div>
      )}
    </div>
  );
}