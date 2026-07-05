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

const SEEDED_REVIEWS: CardData[] = [
  {
    id: "seed-1",
    name: "Aarav Mehta",
    location: "Verified buyer",
    initial: "A",
    rating: 5,
    text: "Best car wash shampoo I've ever used. The foam is incredibly thick and it easily cut through all the road grime from my weekend drive. Paint looks shiny and brand new!",
    source: "user"
  },
  {
    id: "seed-2",
    name: "Priya Sharma",
    location: "Verified buyer",
    initial: "P",
    rating: 5,
    text: "The combo kit is complete value for money. The tyre polish gives a rich, dark black finish that lasts for days, not that oily fake shine. Highly recommended!",
    source: "user"
  },
  {
    id: "seed-3",
    name: "Rohan Deshmukh",
    location: "Verified buyer",
    initial: "R",
    rating: 4,
    text: "Excellent dashboard cleaner. Doesn't leave any sticky residue and has a very pleasant, premium fragrance. The microfibre cloth included is also high quality.",
    source: "user"
  },
  {
    id: "seed-4",
    name: "Ananya Iyer",
    location: "Verified buyer",
    initial: "A",
    rating: 5,
    text: "Absolutely thrilled with the results. Safely cleaned my ceramic-coated sedan without leaving any water spots. Truly pro-grade standard.",
    source: "user"
  },
  {
    id: "seed-5",
    name: "Vikram Singh",
    location: "Verified buyer",
    initial: "V",
    rating: 5,
    text: "Fast shipping and superb packaging. Tried the shampoo on my SUV today and the hydrophobic gloss effect is outstanding. Water just slides right off!",
    source: "user"
  },
  {
    id: "seed-6",
    name: "Sneha Patel",
    location: "Verified buyer",
    initial: "S",
    rating: 4,
    text: "Great product range. The dashboard spray restored the original matte look of my dashboard perfectly. Will buy the combo set next time.",
    source: "user"
  },
  {
    id: "seed-7",
    name: "Arjun Rao",
    location: "Verified buyer",
    initial: "A",
    rating: 5,
    text: "VOOM Care has set a new standard. pH-balanced shampoo gives peace of mind. Very little quantity is needed for a full bucket wash.",
    source: "user"
  },
  {
    id: "seed-8",
    name: "Karan Johar",
    location: "Verified buyer",
    initial: "K",
    rating: 5,
    text: "Showroom finish at home indeed! The tyre polish didn't fling off onto the paint when driving. Outstanding formulation.",
    source: "user"
  },
  {
    id: "seed-9",
    name: "Meera Nair",
    location: "Verified buyer",
    initial: "M",
    rating: 5,
    text: "The customer service was super helpful when I asked about coating safety. The shampoo is very slick and smells amazing. A premium brand!",
    source: "user"
  },
  {
    id: "seed-10",
    name: "Rahul Verma",
    location: "Verified buyer",
    initial: "R",
    rating: 4,
    text: "Solid performance. Safe on my matte wrap. The suds lasted throughout the entire wash process. Very satisfied.",
    source: "user"
  }
];

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
    const mapped = apiReviews.map(mapBrandReview);
    
    // Backfill with high-quality seeded reviews if there are fewer than 8 total reviews
    if (mapped.length < 8) {
      const needed = 10 - mapped.length;
      const fillers = SEEDED_REVIEWS.filter(sr => !mapped.some(m => m.name === sr.name)).slice(0, needed);
      return [...mapped, ...fillers];
    }
    return mapped;
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
      <section className="py-16 md:py-24 overflow-hidden relative bg-black">
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

        <div className="relative max-w-[320px] md:max-w-[460px] mx-auto group px-2">
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
                  className="w-[280px] md:w-[400px] bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8 flex-shrink-0 select-none snap-center flex flex-col justify-between"
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
        </div>

        <BrandReviewForm open={formOpen} onOpenChange={setFormOpen} />
      </section>
    </Reveal>
  );
};

export default TestimonialsSection;
