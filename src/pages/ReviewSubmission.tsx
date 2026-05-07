import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReviewForm } from '@/components/reviews/ReviewSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHybridProduct } from '@/lib/shopify/hooks';

const ReviewSubmission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationData, setValidationData] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (!t) {
      setError('Missing review token');
      setIsValidating(false);
      return;
    }
    setToken(t);
    validateToken(t);
  }, [location.search]);

  const validateToken = async (t: string) => {
    try {
      const res = await fetch('/api/review/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: t })
      });
      const data = await res.json();
      if (data.valid) {
        setValidationData(data);
      } else {
        setError(data.error || 'This link is invalid or has expired');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsValidating(false);
    }
  };

  // Fetch product details for the review page
  const productQuery = useHybridProduct(validationData?.productId);
  const product = productQuery.data;

  if (isValidating) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">Verifying your secure link...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full bg-card border border-border p-8 rounded-3xl text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl text-foreground">Thank You!</h1>
              <p className="text-muted-foreground">Your review has been successfully submitted. It helps other car enthusiasts make better choices.</p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="w-full h-12 gradient-gold text-primary-foreground font-bold rounded-full"
            >
              Continue Shopping
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-red-500/20 p-8 rounded-3xl text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-2xl text-foreground">Link Problem</h1>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full h-12 rounded-full border-border hover:bg-muted"
            >
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <p className="text-xs tracking-[0.4em] uppercase text-primary font-bold">Exclusive Access</p>
              <h1 className="font-display text-4xl text-foreground leading-tight">Write Your Review</h1>
              <p className="text-muted-foreground text-sm">
                We appreciate your purchase from VOOM. Your honest feedback means the world to us.
              </p>
            </div>

            {product && (
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">Order: #{validationData.orderId.split('/').pop()}</p>
                </div>
              </div>
            )}

            <ReviewForm 
              productId={validationData.productId}
              token={token || undefined}
              onSuccess={() => setIsSubmitted(true)}
            />
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewSubmission;
