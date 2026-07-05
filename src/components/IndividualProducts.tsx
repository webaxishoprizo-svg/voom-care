import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Star } from "lucide-react";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Reveal } from "@/components/ScrollReveal";

const IndividualProducts = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: products = [], isLoading } = useCollectionProducts("what-is-inside-the-compo");

  if (isLoading && !products.length) {
    return (
      <section className="py-24 text-center bg-card/20 border-t border-white/5">
        <div className="text-primary tracking-widest uppercase text-xs animate-pulse">
          Loading Standalone Products...
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <Reveal>
      <section className="py-24 bg-card/15 border-y border-white/5 relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/[0.01] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <p className="mb-3 text-[11px] tracking-[0.3em] uppercase text-primary font-medium">
              The Essentials Range
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-tight">
              Shop Standalone Products
            </h2>
            <p className="mt-4 text-muted-foreground/80 text-sm max-w-md mx-auto">
              Our signature professional-grade formulas, available individually to customize your detailing routine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,255,255,0.03)]"
              >
                <div
                  className="relative overflow-hidden aspect-square cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-md shadow-md uppercase">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Showroom Grade
                      </span>
                    </div>

                    <h3
                      className="font-display text-2xl text-foreground group-hover:text-primary transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    
                    <p className="text-muted-foreground/80 text-xs md:text-sm line-clamp-2 leading-relaxed">
                      {product.description || "Premium professional formulas combined for a perfect, long-lasting finish."}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-border/30">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-semibold text-foreground tracking-tight">
                        {formatCurrency(product.price, product.currencyCode)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-muted-foreground text-xs line-through">
                          {formatCurrency(product.originalPrice, product.currencyCode)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void addItem(product);
                      }}
                      className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-md active:scale-95"
                      aria-label="Add to Bag"
                    >
                      <ShoppingBag className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-3 border border-white/10 rounded-md px-8 py-3.5 text-[11px] font-semibold text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all tracking-[0.2em] uppercase"
            >
              <ArrowRight className="w-4 h-4" />
              View Full Collection
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
};

export default IndividualProducts;
