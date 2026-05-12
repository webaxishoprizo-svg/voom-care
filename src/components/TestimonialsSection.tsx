import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, BadgeCheck, Sparkles, MessageSquare } from "lucide-react";
import { fetchBrandReviews, fetchBrandSummary, type BrandReview } from "@/lib/brand-reviews";
import { Button } from "@/components/ui/button";
import BrandReviewForm from "@/components/reviews/BrandReviewForm";

interface CardData {
  id: string;
  text: string;
  name: string;
  location: string;
  initial: string;
  rating: number;
  source: 'user' | 'curated' | 'imported';
}

const sourceLabel: Record<CardData['source'], { label: string; Icon: typeof BadgeCheck }> = {
  user: { label: "Verified Customer", Icon: BadgeCheck },
  curated: { label: "Customer Story", Icon: Sparkles },
  imported: { label: "Imported Feedback", Icon: MessageSquare },
};

const mapBrandReview = (r: BrandReview): CardData => {
  const name = (r.display_name || "Customer").trim();
  return {
    id: r.id,
    text: r.review_text,
    name,
    location: r.is_verified ? "Verified buyer" : "",
    initial: name.charAt(0).toUpperCase() || "C",
    rating: r.rating,
    source: r.source,
  };
};

const TestimonialsSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [formOpen, setFormOpen] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const reviewsQuery = useQuery({
    queryKey: ["brand-reviews", 1, 24],
    queryFn: () => fetchBrandReviews(1, 24),
    staleTime: 5 * 60_000,
  });

  const summaryQuery = useQuery({
    queryKey: ["brand-review-summary"],
    queryFn: fetchBrandSummary,
    staleTime: 5 * 60_000,
  });

  const cards: CardData[] = useMemo(() => {
    const apiReviews = reviewsQuery.data?.reviews || [];
    if (apiReviews.length > 0) return apiReviews.map(mapBrandReview);
    return fallbackTestimonials.map((t, i) => ({
      id: `fallback-${i}`,
      text: t.text,
      name: t.name,
      location: t.location,
      initial: t.initial,
      rating: t.rating,
      source: 'curated' as const,
    }));
  }, [reviewsQuery.data]);

  const items = useMemo(() => [...cards, ...cards, ...cards], [cards]);

  const isMobile = windowWidth < 768;
  const itemWidth = isMobile ? (280 + 20) : (400 + 32);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startAnimation = useCallback(async () => {
    if (cards.length === 0) return;
    await controls.start({
      x: -itemWidth * cards.length,
      transition: { duration: 40, ease: "linear", repeat: Infinity },
    });
  }, [itemWidth, controls, cards.length]);

  useEffect(() => {
    void startAnimation();
  }, [itemWidth, startAnimation]);

  const handleArrowClick = (direction: "left" | "right") => {
    setIsPaused(true);
    const currentX = x.get();
    const moveAmount = direction === "left" ? itemWidth : -itemWidth;
    void controls.start({
      x: currentX + moveAmount,
      transition: { duration: 0.5, ease: "easeOut" }
    }).then(() => {
      setTimeout(() => { setIsPaused(false); void startAnimation(); }, 3000);
    });
  };

  const handleDragStart = () => { setIsPaused(true); controls.stop(); };
  const handleDragEnd = () => {
    setTimeout(() => { setIsPaused(false); void startAnimation(); }, 2000);
  };

  const summary = summaryQuery.data;
  const hasRealReviews = (reviewsQuery.data?.reviews?.length || 0) > 0;

  return (
    <section className="py-16 md:py-24 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 mb-12 md:mb-16 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Customer Love</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground font-bold tracking-tight">
          What They're Saying
        </h2>

        {summary && summary.totalReviews > 0 && (
          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className={`w-4 h-4 ${n <= Math.round(summary.averageRating) ? "fill-primary text-primary" : "fill-muted/20 text-muted/30"}`} />
              ))}
            </div>
            <span className="font-semibold text-foreground">{summary.averageRating.toFixed(1)}/5</span>
            <span>·</span>
            <span>{summary.totalReviews} review{summary.totalReviews === 1 ? "" : "s"}</span>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
            Write a review
          </Button>
        </div>
      </div>

      <div className="relative group">
        <button
          onClick={() => handleArrowClick("left")}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleArrowClick("right")}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          ref={containerRef}
          style={{ x }}
          animate={controls}
          drag="x"
          dragConstraints={{ left: -itemWidth * cards.length * 2, right: 0 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="flex gap-5 md:gap-8 px-4 w-max cursor-grab active:cursor-grabbing"
        >
          {items.map((t, i) => {
            const Tag = sourceLabel[t.source];
            return (
              <div
                key={`${t.id}-${i}`}
                className="w-[280px] md:w-[400px] bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 flex-shrink-0 select-none"
              >
                <div className="flex items-center justify-between mb-4 md:mb-5 gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3.5 h-3.5 md:w-4 md:h-4 ${j < t.rating ? "fill-primary text-primary" : "fill-muted/20 text-muted/20"}`}
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground border border-border/60 rounded-full px-2 py-0.5">
                    <Tag.Icon className="w-3 h-3" />
                    {Tag.label}
                  </span>
                </div>
                <blockquote className="text-foreground/90 italic leading-relaxed mb-6 md:mb-8 text-[15px] md:text-lg font-light line-clamp-6">
                  {t.text}
                </blockquote>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base md:text-lg border border-primary/20">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm md:text-base tracking-wide">{t.name}</p>
                    {t.location && (
                      <p className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-widest">{t.location}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <BrandReviewForm open={formOpen} onOpenChange={setFormOpen} />
    </section>
  );
};

export default TestimonialsSection;
