import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, useAnimation, useMotionValue, useTransform, MotionValue } from "framer-motion";
import { Bookmark, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/data/products";

const ProductCard = ({ product, index, x, itemWidth, productsCount }: { 
  product: Product; 
  index: number; 
  x: MotionValue<number>; 
  itemWidth: number; 
  productsCount: number;
}) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // Calculate relative position to screen center
  const scale = useTransform(x, (val: number) => {
    const screenWidth = window.innerWidth;
    const center = screenWidth / 2;
    
    // Calculate current X position of this card center
    // We account for the index and the current marquee translation
    const cardCenterInMarquee = (index * itemWidth) + (itemWidth / 2);
    let currentPos = cardCenterInMarquee + val;
    
    // Correct for infinite wrapping (approximate)
    const totalWidth = itemWidth * productsCount * 3;
    while (currentPos < -itemWidth) currentPos += itemWidth * productsCount;
    while (currentPos > screenWidth + itemWidth) currentPos -= itemWidth * productsCount;

    const distanceFromCenter = Math.abs(center - currentPos);
    const threshold = itemWidth;
    
    if (distanceFromCenter > threshold) return 0.85;
    return 1.15 - (distanceFromCenter / threshold) * 0.3;
  });

  const brightness = useTransform(scale, [0.85, 1.15], [0.6, 1.1]);
  const zIndex = useTransform(scale, [0.85, 1.15], [1, 20]);

  return (
    <motion.div
      style={{ scale, opacity: brightness, zIndex }}
      className="w-[280px] md:w-[350px] bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden group select-none flex-shrink-0 relative transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] will-change-transform"
    >
      <div 
         className="aspect-[3/4] relative cursor-pointer overflow-hidden"
         onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {product.discount && (
          <span className="absolute top-4 left-4 z-10 bg-primary/80 backdrop-blur-sm text-primary-foreground text-[11px] tracking-wide px-3 py-1 rounded-full font-bold">
            {product.discount}% OFF
          </span>
        )}
        
        <button 
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/60 transition-all opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-5 px-5">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h4 className="font-display text-xl text-white font-bold tracking-wide">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-primary font-bold text-lg">
                  {formatCurrency(product.price, product.currencyCode)}
                </span>
                {product.originalPrice && (
                  <span className="text-white/40 line-through text-xs font-light">
                    {formatCurrency(product.originalPrice, product.currencyCode)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(event) => {
                event.stopPropagation();
                void addItem(product);
              }}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg active:scale-95"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductGrid = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: products = [], isLoading } = useCollectionProducts("best-seller");

  // Multi-duplicate for infinite effect
  const items = useMemo(() => {
    if (!products.length) return [];
    // 3 duplicates is usually enough for infinite effect and and much lighter than 5
    return [...products, ...products, ...products];
  }, [products]);
  
  const isMobile = windowWidth < 768;
  const cardWidth = isMobile ? 280 : 350;
  const gap = isMobile ? 20 : 32;
  const itemWidth = cardWidth + gap;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startAnimation = useCallback(async () => {
    if (!products.length) return;
    await controls.start({
      x: -itemWidth * products.length,
      transition: {
        duration: 18,
        ease: "linear",
        repeat: Infinity,
      },
    });
  }, [products.length, itemWidth, controls]);

  useEffect(() => {
    if (products.length > 0) {
      void startAnimation();
    }
  }, [products.length, itemWidth, startAnimation]);

  const handleArrowClick = (direction: "left" | "right") => {
    setIsPaused(true);
    const currentX = x.get();
    const moveAmount = direction === "left" ? itemWidth : -itemWidth;
    
    void controls.start({
      x: currentX + moveAmount,
      transition: { duration: 0.3, ease: "circOut" }
    }).then(() => {
      setTimeout(() => {
        setIsPaused(false);
        void startAnimation();
      }, 1500);
    });
  };

  const handleDragStart = () => {
    setIsPaused(true);
    controls.stop();
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsPaused(false);
      void startAnimation();
    }, 1500);
  };

  return (
    <section id="collections" className="py-24 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 mb-16 text-center">
        <p className="text-[13px] tracking-wide font-medium text-primary mb-2">The Elite Edit</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold tracking-normal">
          Best Sellers
        </h2>
      </div>

      <div className="relative group perspective-1000">
        {/* Navigation Arrows - Desktop Only */}
        <button
          onClick={() => handleArrowClick("left")}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleArrowClick("right")}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-background via-background/60 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-background via-background/60 to-transparent z-20 pointer-events-none" />

        {isLoading || !products.length ? (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Curating best sellers...
          </div>
        ) : (
          <motion.div
            ref={containerRef}
            style={{ x }}
            animate={controls}
            drag="x"
            dragConstraints={{ left: -itemWidth * products.length * 3, right: 0 }}
            dragElastic={0.1}
            dragMomentum={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="flex gap-5 md:gap-8 px-4 w-max cursor-grab active:cursor-grabbing items-center py-10"
          >
            {items.map((product, index) => (
              <ProductCard 
                key={`${product.id}-${index}`}
                product={product}
                index={index}
                x={x}
                itemWidth={itemWidth}
                productsCount={products.length}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="mt-16 text-center px-4">
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-3 border border-white/10 rounded-full px-10 py-3.5 text-[13px] font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all tracking-wide"
        >
          <ArrowRight className="w-4 h-4" />
          Browse Full Selection
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
