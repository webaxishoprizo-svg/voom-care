import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, useAnimation, useMotionValue, useTransform, MotionValue } from "framer-motion";
import { Bookmark, ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

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
      className="w-[280px] md:w-[350px] glass-card overflow-hidden group select-none flex-shrink-0 relative transition-shadow duration-500 hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] will-change-transform"
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
          <span className="absolute top-4 left-4 z-10 bg-primary/90 text-primary-foreground text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-md font-semibold">
            {product.discount}% OFF
          </span>
        )}

        <button
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-md bg-background/40 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-background/60 transition-all opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Bookmark className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-20 pb-5 px-5">
          {product.price > 0 && (
            <div className="flex items-end justify-between w-full">
              <div className="space-y-1">
                <h4 className="font-display text-lg md:text-xl text-white tracking-wide">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-primary font-semibold text-base md:text-lg tracking-tight">
                    {formatCurrency(product.price, product.currencyCode)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-white/40 line-through text-xs">
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
                className="w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
          {product.price === 0 && (
            <h4 className="font-display text-lg md:text-xl text-white tracking-wide">
              {product.name}
            </h4>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SingleProductFeatured = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative group rounded-md overflow-hidden glass-card p-1 lg:p-2 border border-white/5"
      >
        <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-0">
          {/* Image Section */}
          <div
            className="aspect-square lg:aspect-[4/5] relative rounded-sm overflow-hidden cursor-pointer group"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {product.discount && (
              <div className="absolute top-6 left-6 z-10 px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-[10px] font-semibold tracking-[0.2em] uppercase shadow-xl">
                Exclusive {product.discount}% Off
              </div>
            )}

            {product.price > 0 && (
              <>
                <div className="absolute bottom-4 left-4 z-20 md:hidden flex flex-col items-start">
                  <div className="flex items-baseline gap-2">
                    <span className="font-sans text-2xl text-foreground font-semibold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {formatCurrency(product.price, product.currencyCode)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-white/60 line-through text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {formatCurrency(product.originalPrice, product.currencyCode)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 z-20 md:hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      void addItem(product);
                    }}
                    className="w-12 h-12 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-95"
                  >
                    <ShoppingBag className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-16 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest ml-1">Showroom Grade</span>
              </div>
              <h3 className="font-display text-4xl lg:text-6xl text-foreground italic tracking-tight leading-[1.1]">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-sm">
                <span className="md:hidden">Professional kit for a perfect showroom finish.</span>
                <span className="hidden md:inline">The ultimate comprehensive car care kit. Professional formulas combined for a perfect, long-lasting showroom finish.</span>
              </p>
            </div>

            {product.price > 0 ? (
              <>
                <div className="hidden md:flex items-baseline gap-4">
                  <span className="text-3xl lg:text-5xl font-semibold tracking-tight text-foreground">
                    {formatCurrency(product.price, product.currencyCode)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through text-lg">
                      {formatCurrency(product.originalPrice, product.currencyCode)}
                    </span>
                  )}
                </div>

                <div className="hidden md:flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button
                    onClick={() => addItem(product)}
                    className="w-full sm:w-auto h-12 px-10 rounded-md bg-primary text-primary-foreground font-semibold tracking-[0.2em] uppercase text-[11px] hover:bg-primary/90 transition-all shadow-lg active:scale-95"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full sm:w-auto h-12 px-8 rounded-md border border-white/10 hover:bg-white/5 text-foreground/80 hover:text-foreground font-semibold tracking-[0.2em] uppercase text-[10px] transition-all"
                  >
                    View Details
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4">
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full sm:w-auto h-12 px-8 rounded-md border border-white/10 hover:bg-white/5 text-foreground/80 hover:text-foreground font-semibold tracking-[0.2em] uppercase text-[10px] transition-all"
                >
                  View Details
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProductGrid = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading } = useCollectionProducts("compo");

  // Multi-duplicate for infinite effect
  const items = useMemo(() => {
    if (!products.length || products.length === 1) return [];
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
    if (products.length <= 1) return;
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
    if (products.length > 1) {
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

  if (isLoading && !products.length) {
    return (
      <section className="py-24 text-center">
        <div className="text-primary tracking-widest uppercase text-xs animate-pulse">Loading Combo...</div>
      </section>
    );
  }

  return (
    <section id="collections" className="py-24 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 mb-16 text-center">
        <p className="text-[13px] tracking-wide font-medium text-primary mb-2">The Signature Series</p>
        <h2 className="font-display text-4xl md:text-6xl text-foreground font-bold tracking-normal uppercase italic">
          Combo
        </h2>
      </div>

      {products.length === 1 ? (
        <SingleProductFeatured product={products[0]} />
      ) : products.length > 1 ? (
        <div className="relative group perspective-1000">
          {/* Navigation Arrows - Desktop Only */}
          <button
            onClick={() => handleArrowClick("left")}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-md bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleArrowClick("right")}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-md bg-surface-glass border border-white/10 hidden md:flex items-center justify-center text-foreground hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-r from-background via-background/60 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-48 bg-gradient-to-l from-background via-background/60 to-transparent z-20 pointer-events-none" />

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
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">No items in this collection.</div>
      )}

      {products.length > 1 && (
        <div className="mt-16 text-center px-4">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-3 border border-white/10 rounded-md px-8 py-3 text-[12px] font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all tracking-[0.15em] uppercase"
          >
            <ArrowRight className="w-4 h-4" />
            Browse Full Selection
          </Link>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
