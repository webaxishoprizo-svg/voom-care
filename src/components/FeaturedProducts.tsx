import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCollectionProducts } from "@/lib/shopify/hooks";

const FeaturedProducts = () => {
  const { data: products = [], isLoading } = useCollectionProducts("what-is-inside-the-compo");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [products.length]);

  if (isLoading && !products.length) {
    return (
      <div className="h-[60vh] flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="text-primary tracking-widest uppercase text-xs animate-pulse">Loading Compo Details...</div>
      </div>
    );
  }

  if (!products.length && !isLoading) {
    return (
      <div className="h-[40vh] flex items-center justify-center bg-black/5 border-y border-white/5">
        <div className="text-muted-foreground/40 tracking-[0.2em] uppercase text-[10px]">
          [ Breakdown Section: No products found in "what-is-insice-the-compo" ]
        </div>
      </div>
    );
  }

  if (!products.length) return null;

  const currentProduct = products[currentIndex];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-32 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-4xl"
            >
              <p className="text-primary text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 font-bold">
                The Compo Breakdown
              </p>
              <h2 className="font-display text-4xl md:text-7xl text-white italic mb-6 tracking-tight leading-tight">
                {currentProduct.name}
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-light tracking-wide">
                <span className="md:hidden">{currentProduct.name} - Showroom grade finish.</span>
                <span className="hidden md:inline">{currentProduct.description?.split('.')[0]}. Hand-selected for the ultimate showroom finish.</span>
              </p>
              
              <Link
                to="/collections/what-is-inside-the-compo"
                className="mt-4 px-12 py-3.5 glass-card rounded-full text-foreground text-[12px] font-medium tracking-wide hover:bg-white/10 transition-all duration-500 backdrop-blur-md inline-block"
              >
                Explore Collection
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="group relative h-10 w-2 flex items-center justify-center"
          >
            <div 
              className={`w-0.5 transition-all duration-700 ${
                idx === currentIndex ? "h-6 bg-primary" : "h-3 bg-white/20 group-hover:bg-white/40"
              }`} 
            />
          </button>
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-10 right-10 z-30 flex items-baseline gap-1">
        <span className="text-white text-2xl font-display italic">{(currentIndex + 1).toString().padStart(2, '0')}</span>
        <span className="text-white/20 text-xs font-bold">/ {products.length.toString().padStart(2, '0')}</span>
      </div>
    </section>
  );
};

export default FeaturedProducts;
