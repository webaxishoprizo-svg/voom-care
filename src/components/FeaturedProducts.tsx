import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useCollectionProducts("what-is-inside-the-compo");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4500, stopOnInteraction: false })]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  if (isLoading && !products.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="text-primary tracking-widest uppercase text-xs animate-pulse">Loading Combo Details...</div>
      </div>
    );
  }

  if (!products.length && !isLoading) {
    return (
      <div className="h-[40vh] flex items-center justify-center bg-black/5 border-y border-white/5">
        <div className="text-muted-foreground/40 tracking-[0.2em] uppercase text-[10px]">
          [ Breakdown Section: No products found in "what-is-insice-the-combo" ]
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <div className="overflow-hidden h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full">
          {products.map((product) => (
            <div key={product.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-32 px-6 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="max-w-4xl"
                >
                  <p className="text-primary text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 font-semibold">
                    The Combo Breakdown
                  </p>
                  <h2 className="font-display text-4xl md:text-7xl text-white italic mb-6 tracking-tight leading-[1.05]">
                    {product.name}
                  </h2>
                  <p className="text-white/65 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
                    <span className="md:hidden">{product.name} - Showroom grade finish.</span>
                    <span className="hidden md:inline">{product.description?.split('.')[0]}. Hand-selected for the ultimate showroom finish.</span>
                  </p>

                  <Link
                    to="/products?collection=compo"
                    className="mt-4 px-10 py-3.5 glass-card rounded-md text-foreground text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-500 backdrop-blur-md inline-block"
                  >
                    Explore Voom
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className="group relative h-10 w-2 flex items-center justify-center"
          >
            <div
              className={`w-0.5 transition-all duration-700 ${idx === currentIndex ? "h-6 bg-primary" : "h-3 bg-white/20 group-hover:bg-white/40"
                }`}
            />
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-10 right-10 z-30 hidden md:flex items-baseline gap-1">
        <span className="text-white text-2xl font-display italic">{(currentIndex + 1).toString().padStart(2, '0')}</span>
        <span className="text-white/20 text-xs font-bold">/ {products.length.toString().padStart(2, '0')}</span>
      </div>
    </section>
  );
};

export default FeaturedProducts;
