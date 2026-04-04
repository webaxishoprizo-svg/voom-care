import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroMask from "@/assets/hero-mask.jpg";
import heroAqua from "@/assets/hero-aqua.jpg";

const slides = [
  { image: heroMask, title: "Mask", subtitle: "BESTSELLER", label: "PREMIUM · HANDCRAFTED · EXOTIC" },
  { image: heroAqua, title: "AQUA NOR", subtitle: "BESTSELLER", label: "PREMIUM · HANDCRAFTED · EXOTIC" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <motion.h1
          key={`title-${current}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display italic text-6xl md:text-8xl lg:text-9xl text-foreground"
        >
          {slides[current].title}
        </motion.h1>
        <motion.a
          href="#collections"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 px-10 py-3 border border-foreground/40 rounded-full text-foreground text-sm tracking-widest uppercase hover:bg-foreground/10 transition-colors"
        >
          Explore Fragrance
        </motion.a>
      </div>

      {/* Info card */}
      <motion.div
        key={`card-${current}`}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-12 left-6 md:left-16 z-10 bg-surface-glass rounded-xl p-6 max-w-xs"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">{slides[current].subtitle}</p>
        <h3 className="font-display text-2xl text-foreground">{slides[current].title}</h3>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">{slides[current].label}</p>
      </motion.div>

      {/* Navigation arrows */}
      <button onClick={prev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-surface-glass flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-surface-glass flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors">
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
};

export default HeroCarousel;
