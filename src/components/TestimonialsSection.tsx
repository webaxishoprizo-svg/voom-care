import { useState, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, ChevronLeft, ChevronRight, BadgeCheck, Sparkles, MessageSquare } from "lucide-react";
import { fetchBrandReviews, fetchBrandSummary, type BrandReview } from "@/lib/brand-reviews";
import { Button } from "@/components/ui/button";
import BrandReviewForm from "@/components/reviews/BrandReviewForm";
import { Reveal } from "@/components/ScrollReveal";

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
  const name = (r.display_name || "Verified Customer").trim();
  return {
    id: r.id,
    text: r.review_text,
    name,
    location: r.is_verified ? "Verified buyer" : "",
    initial: name.charAt(0).toUpperCase() || "V",
    rating: r.rating || 5,
    source: r.source || 'user',
  };
};

const TestimonialsSection = () => {
  const [formOpen, setFormOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

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
    return apiReviews.map(mapBrandReview);
  }, [reviewsQuery.data]);

  const handleArrowClick = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const cardElement = carouselRef.current.firstElementChild as HTMLElement;
    if (!cardElement) return;

    const style = window.getComputedStyle(carouselRef.current);
    const gap = parseFloat(style.columnGap || style.gap || "24px");
    const stepWidth = cardElement.offsetWidth + gap;

    const scrollAmount = direction === "left" ? -stepWidth : stepWidth;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const summary = summaryQuery.data;

  return (
    <Reveal>
      <section className="py-16 md:py-24 overflow-hidden relative bg-background border-y border-white/5">
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

        <div className="relative max-w-[320px] md:max-w-6xl mx-auto group px-2 md:px-12">
          {cards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/60 text-sm border border-dashed border-border/40 rounded-2xl bg-card/10">
              No reviews yet. Be the first to write a review!
            </div>
          ) : (
            <>
              {/* Arrow Buttons - Repositioned outside of the clipped container */}
              <button
                onClick={() => handleArrowClick("left")}
                className="absolute -left-14 top-1/2 -translate-y-1/2 z-25 w-10 h-10 rounded-full bg-black/60 border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleArrowClick("right")}
                className="absolute -right-14 top-1/2 -translate-y-1/2 z-25 w-10 h-10 rounded-full bg-black/60 border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel snap-scroll viewport */}
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {cards.map((t, i) => {
                  const Tag = sourceLabel[t.source];
                  return (
                    <div
                      key={`${t.id}-${i}`}
                      className="w-[280px] md:w-[350px] lg:w-[360px] bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 flex-shrink-0 select-none snap-center flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4 md:mb-5 gap-3">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`w-3.5 h-3.5 md:w-4 md:h-4 ${j < t.rating ? "fill-primary text-primary" : "fill-muted/20 text-muted/20"}`}
                              />
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground border border-border/60 rounded-full px-2 py-0.5">
                            <Tag.Icon className="w-3.5 h-3.5" />
                            {Tag.label}
                          </span>
                        </div>
                        <blockquote className="text-foreground/90 italic leading-relaxed mb-6 text-sm md:text-base font-light line-clamp-5">
                          "{t.text}"
                        </blockquote>
                      </div>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm border border-primary/25">
                          {t.initial}
                        </div>
                        <div>
                          <p className="text-foreground font-semibold text-xs md:text-sm tracking-wide">{t.name}</p>
                          {t.location && (
                            <p className="text-muted-foreground text-[9px] md:text-xs uppercase tracking-widest">{t.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <BrandReviewForm open={formOpen} onOpenChange={setFormOpen} />
      </section>
    </Reveal>
  );
};

export default TestimonialsSection;
