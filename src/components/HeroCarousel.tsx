import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useHeroSlides } from "@/lib/shopify/hooks";

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const { data: slides, isLoading } = useHeroSlides();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const timer = window.setInterval(
      () => setCurrent((value) => (value + 1) % slides.length),
      5000,
    );

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setCurrent((value) => (slides.length && value < slides.length ? value : 0));
  }, [slides.length]);

  if (isLoading && !slides.length) {
    return <section className="relative h-screen w-full overflow-hidden bg-background" />;
  }

  if (!slides.length) {
    return null;
  }

  const currentSlide = slides[current];
  const prev = () => setCurrent((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setCurrent((value) => (value + 1) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {isMobile ? (
            currentSlide.mobileVideo ? (
              <video
                key={currentSlide.mobileVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                poster={currentSlide.mobileImage || currentSlide.image}
              >
                <source src={currentSlide.mobileVideo} />
              </video>
            ) : (
              <img
                src={currentSlide.mobileImage || currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
                width={1080}
                height={1440}
              />
            )
          ) : (
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <motion.h2
          key={`heading-${currentSlide.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="font-display italic text-[clamp(2.5rem,7vw,5.5rem)] text-foreground leading-[1.1] mb-6 tracking-normal"
        >
          Signature Series
        </motion.h2>
        {currentSlide.description && (
          <motion.p
            key={`desc-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[clamp(0.9rem,2.5vw,1.4rem)] text-foreground/60 max-w-lg mx-auto leading-relaxed tracking-normal italic font-light"
          >
            {currentSlide.description}
          </motion.p>
        )}
        <motion.a
          href={currentSlide.ctaHref || "#collections"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 px-12 py-3.5 glass-card rounded-full text-foreground text-[12px] font-medium tracking-wide hover:bg-white/10 transition-all duration-500 backdrop-blur-md"
        >
          Explore Collection
        </motion.a>
      </div>

      <Link to={currentSlide.ctaHref || "#"}>
        <motion.div
          key={`card-${currentSlide.id}`}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute bottom-12 left-6 md:left-16 z-20 bg-surface-glass rounded-xl p-6 max-w-[240px] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
        >
          <p className="text-[11px] tracking-wide font-medium text-foreground/40 mb-2">
            {currentSlide.subtitle || "Bestseller"}
          </p>
          <h3 className="font-display italic text-2xl md:text-3xl text-foreground tracking-normal leading-tight group-hover:text-primary transition-colors">
            {currentSlide.title}
          </h3>
          <p className="text-[10px] md:text-[11px] tracking-widest text-foreground/40 mt-5 font-medium">
            Warm • Woody • Sensual
          </p>
        </motion.div>
      </Link>

      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-surface-glass hidden md:flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-surface-glass hidden md:flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default HeroCarousel;
