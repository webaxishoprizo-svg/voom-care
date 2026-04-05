import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, ArrowRight, ShoppingBag } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";

const ProductGrid = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    skipSnaps: false,
    containScroll: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: products, isLoading } = useCollectionProducts("best-seller");

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !products.length) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, products.length]);

  useEffect(() => {
    setSelectedIndex((value) => (products.length && value < products.length ? value : 0));
  }, [products.length]);

  return (
    <section id="collections" className="py-16 px-0">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-1">Top Picks</p>
            <h2 className="font-display text-3xl md:text-5xl text-foreground font-bold">
              BEST
              <br />
              SELLERS
            </h2>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-2 border border-muted-foreground/30 rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Discover all items
          </Link>
        </div>
      </div>

      {isLoading && !products.length ? (
        <div className="max-w-6xl mx-auto px-4 text-muted-foreground">Loading products...</div>
      ) : products.length ? (
        <>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product, index) => {
                const isActive = index === selectedIndex;
                return (
                  <div
                    key={product.id}
                    className="flex-[0_0_75%] md:flex-[0_0_45%] lg:flex-[0_0_35%] min-w-0 px-2"
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1 : 0.9,
                        opacity: isActive ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="relative rounded-2xl overflow-hidden bg-card"
                    >
                      <button className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/40 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>

                      {product.discount && (
                        <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-md font-semibold">
                          {product.discount}% OFF
                        </span>
                      )}

                      <div
                        className="aspect-[3/4] relative cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-16 pb-4 px-4">
                          <div className="flex items-end justify-between">
                            <h4 className="font-display text-lg md:text-xl text-foreground font-bold uppercase tracking-wide">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-primary font-bold text-lg">
                                  {formatCurrency(product.price, product.currencyCode)}
                                </span>
                                {product.originalPrice && (
                                  <span className="block text-muted-foreground line-through text-xs">
                                    {formatCurrency(
                                      product.originalPrice,
                                      product.currencyCode,
                                    )}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  void addItem(product);
                                }}
                                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                              >
                                <ShoppingBag className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-6xl mx-auto px-4 text-muted-foreground">
          No best-seller products found in Shopify.
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
