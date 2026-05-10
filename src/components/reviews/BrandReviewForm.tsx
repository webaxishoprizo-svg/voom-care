import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import {
  fetchBrandEligibility,
  submitBrandReview,
  updateBrandReview,
  type BrandReview,
} from "@/lib/brand-reviews";

interface BrandReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Stars = ({ value, onChange, size = 28 }: { value: number; onChange: (n: number) => void; size?: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="transition-transform hover:scale-110"
        aria-label={`${n} star${n > 1 ? "s" : ""}`}
      >
        <Star
          style={{ width: size, height: size }}
          className={n <= value ? "fill-primary text-primary" : "fill-muted/20 text-muted-foreground"}
        />
      </button>
    ))}
  </div>
);

const BrandReviewForm = ({ open, onOpenChange }: BrandReviewFormProps) => {
  const { customerAccessToken, isAuthenticated, login } = useCustomerAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [support, setSupport] = useState(0);
  const [overall, setOverall] = useState(0);
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState("");

  const eligibility = useQuery({
    queryKey: ["brand-review-eligibility", customerAccessToken],
    queryFn: () => fetchBrandEligibility(customerAccessToken),
    enabled: open && !!customerAccessToken,
    staleTime: 60_000,
  });

  const existing: BrandReview | null = eligibility.data?.existingReview || null;
  const isEditMode = !!existing;

  useEffect(() => {
    if (existing) {
      setRating(existing.rating);
      setDelivery(existing.delivery_rating || 0);
      setSupport(existing.support_rating || 0);
      setOverall(existing.overall_rating || existing.rating);
      setText(existing.review_text || "");
      setDisplayName(existing.display_name || "");
    } else if (open) {
      setRating(0); setDelivery(0); setSupport(0); setOverall(0); setText(""); setDisplayName("");
    }
  }, [existing, open]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!customerAccessToken) throw new Error("Not authenticated");
      const payload = {
        rating,
        review: text,
        deliveryRating: delivery || undefined,
        supportRating: support || undefined,
        overallRating: overall || rating,
        displayName: displayName || undefined,
      };
      return isEditMode
        ? updateBrandReview(customerAccessToken, payload)
        : submitBrandReview(customerAccessToken, payload);
    },
    onSuccess: () => {
      toast({ title: isEditMode ? "Review updated" : "Review submitted", description: "Thank you for sharing your experience." });
      queryClient.invalidateQueries({ queryKey: ["brand-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["brand-review-summary"] });
      queryClient.invalidateQueries({ queryKey: ["brand-review-eligibility"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast({ title: "Could not submit review", description: err?.message || "Please try again.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast({ title: "Rating required", description: "Please select an overall rating.", variant: "destructive" });
      return;
    }
    if (text.trim().length < 10) {
      toast({ title: "Review too short", description: "Please write at least 10 characters.", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isEditMode ? "Edit your review" : "Share your experience"}
          </DialogTitle>
          <DialogDescription>
            Tell others about delivery, support, and your overall experience with the brand.
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="py-6 text-center space-y-4">
            <p className="text-muted-foreground text-sm">Please sign in with your account to write a brand review.</p>
            <Button onClick={() => login(window.location.pathname)} className="w-full">Sign in</Button>
          </div>
        ) : eligibility.isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Overall rating</Label>
              <Stars value={rating} onChange={setRating} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Delivery</Label>
                <Stars value={delivery} onChange={setDelivery} size={20} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Support</Label>
                <Stars value={support} onChange={setSupport} size={20} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Satisfaction</Label>
                <Stars value={overall} onChange={setOverall} size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-review-name">Display name (optional)</Label>
              <input
                id="brand-review-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value.slice(0, 80))}
                placeholder="How should we credit you?"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-review-text">Your review</Label>
              <textarea
                id="brand-review-text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 1000))}
                rows={5}
                placeholder="Share your experience with delivery, support, and the products..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                required
              />
              <p className="text-[11px] text-muted-foreground text-right">{text.length}/1000</p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={mutation.isPending} className="flex-1">
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditMode ? "Update review" : "Submit review"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrandReviewForm;
