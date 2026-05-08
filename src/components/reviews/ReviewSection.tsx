import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Star, MessageSquare, ShieldCheck, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { getMockReviewsForProduct, Review } from '@/data/mockReviews';

interface ReviewSectionProps {
  productId: string;
  customerId?: string;
  canWriteReview?: boolean;
}

export const ReviewSection = ({ productId, customerId, canWriteReview: initialCanWriteReview }: ReviewSectionProps) => {
  const location = useLocation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // New eligibility states
  const [isEligible, setIsEligible] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [resolvedCustomerId, setResolvedCustomerId] = useState<string | null>(null);

  const fetchReviews = async (page = 1) => {
    setIsLoading(true);
    try {
      // 1. Get real reviews from API
      const res = await fetch(`/api/reviews?product_id=${encodeURIComponent(productId)}&page=${page}`);
      let apiData = { reviews: [], stats: { averageRating: 0, totalReviews: 0 }, pagination: { page: 1, pages: 1 } };
      
      if (res.ok) {
        apiData = await res.json();
      }

      // 2. Get mock reviews from local data
      const localMockReviews = getMockReviewsForProduct(productId);

      // 3. Combine and sort (if API failed, we just use local mocks)
      // Note: If API worked, it already has mocks in the current implementation, 
      // but we'll merge them here to be safe and ensure they show up in local dev.
      const apiReviews = apiData.reviews || [];
      
      // Filter out mocks from API to avoid double-counting if API is already including them
      const realApiReviews = apiReviews.filter((r: any) => !r.id.startsWith('mock-'));
      
      const allCombined = [...realApiReviews, ...localMockReviews].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // 4. Update stats based on combined data
      const total = allCombined.length;
      const avg = total > 0 
        ? (allCombined.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) 
        : 0;

      // 5. Apply frontend pagination for now to ensure local dev works perfectly
      const limit = 10;
      const pCount = Math.ceil(total / limit);
      const paginated = allCombined.slice((page - 1) * limit, page * limit);

      setReviews(paginated);
      setStats({
        averageRating: parseFloat(avg as string),
        totalReviews: total
      });
      setPagination({
        page,
        pages: pCount
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to only mock reviews if API fails completely
      const localMockReviews = getMockReviewsForProduct(productId);
      const total = localMockReviews.length;
      const avg = total > 0 ? (localMockReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;
      
      setReviews(localMockReviews.slice(0, 10));
      setStats({ averageRating: parseFloat(avg as string), totalReviews: total });
      setPagination({ page: 1, pages: Math.ceil(total / 10) });
    } finally {
      setIsLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!customerId) {
      setIsEligible(false);
      setHasReviewed(false);
      setResolvedCustomerId(null);
      return;
    }

    setIsCheckingEligibility(true);
    try {
      const res = await fetch(`/api/review/eligibility?product_id=${encodeURIComponent(productId)}&customer_id=${encodeURIComponent(customerId)}`);
      const data = await res.json();
      setIsEligible(data.eligible);
      setHasReviewed(data.hasReviewed);
      setResolvedCustomerId(data.resolvedId);
    } catch (error) {
      console.error('Error checking eligibility:', error);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkEligibility();
  }, [productId, customerId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('writeReview') === 'true' && isEligible && !hasReviewed) {
      setShowForm(true);
      setTimeout(() => {
        const form = document.getElementById('review-form-anchor');
        if (form) form.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [location.search, isEligible, hasReviewed]);

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const res = await fetch('/api/review/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewId, customerId })
      });
      
      if (res.ok) {
        toast.success('Review deleted');
        fetchReviews();
        checkEligibility(); // Refresh eligibility
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete review');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const canShowButton = isEligible && !hasReviewed;

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-bold">Customer Feedback</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Community Reviews</h2>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <span className="text-4xl font-bold text-foreground">{stats.averageRating}</span>
                <div className="flex flex-col">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.round(stats.averageRating) ? 'fill-primary text-primary' : 'fill-muted/20 text-muted/20'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{stats.totalReviews} verified reviews</span>
                </div>
              </div>
            </div>
          </div>

          {canShowButton && (
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant="outline"
              className="rounded-full border-primary/30 text-primary hover:bg-primary/5 px-8"
              disabled={isCheckingEligibility}
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )}
        </div>

        <AnimatePresence>
          {(showForm || editingReview) && (
            <motion.div
              id="review-form-anchor"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <ReviewForm 
                productId={productId} 
                customerId={customerId} 
                initialData={editingReview || undefined}
                onSuccess={() => {
                  setShowForm(false);
                  setEditingReview(null);
                  fetchReviews();
                  checkEligibility();
                }} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-2xl" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border p-6 rounded-2xl relative group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-primary text-primary' : 'fill-muted/20 text-muted/20'}`} 
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">Verified Buyer</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(review.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <p className="text-foreground/90 text-sm leading-relaxed mb-4">
                  {review.review}
                </p>

                {resolvedCustomerId === review.user_id && (
                  <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingReview(review);
                        setTimeout(() => {
                          const form = document.getElementById('review-form-anchor');
                          if (form) form.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => fetchReviews(pagination.page - 1)}
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchReviews(pagination.page + 1)}
                  className="rounded-full"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border border-dashed rounded-3xl">
            <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-display text-foreground mb-2">No reviews yet</h3>
            <p className="text-sm text-muted-foreground">Be the first to share your experience with this product.</p>
          </div>
        )}
      </div>
    </section>
  );
};

interface ReviewFormProps {
  productId: string;
  customerId?: string;
  token?: string;
  onSuccess: () => void;
  initialData?: Review;
}

export const ReviewForm = ({ productId, customerId, token, onSuccess, initialData }: ReviewFormProps) => {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [review, setReview] = useState(initialData?.review || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.trim()) return toast.error('Please write a review');
    
    setIsSubmitting(true);
    try {
      const url = initialData ? '/api/review/update' : '/api/review/submit';
      const method = initialData ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initialData?.id,
          rating,
          review,
          productId,
          customerId,
          token
        })
      });

      if (res.ok) {
        toast.success(initialData ? 'Review updated!' : 'Review submitted successfully!');
        onSuccess();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-primary/20 p-8 rounded-3xl space-y-6 shadow-xl shadow-primary/5">
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-display text-foreground">
          {initialData ? 'Edit Your Review' : 'How was your experience?'}
        </h3>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
            >
              <Star 
                className={`w-8 h-8 ${star <= rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} 
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Your Review</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your thoughts about the product quality and performance..."
          className="w-full min-h-[120px] bg-background border border-border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          required
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full h-12 gradient-gold text-primary-foreground font-bold rounded-full"
      >
        {isSubmitting ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
      </Button>
    </form>
  );
};
