import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";

const MostCoveted = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data = [], isLoading } = useHybridProducts();
  const products = data.slice(0, 4);

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">New Exclusive</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground font-bold tracking-wide">OUR COLLECTION</h2>
        </div>

        {isLoading && !products.length ? (
          <div className="text-center text-muted-foreground">Loading products...</div>
        ) : products.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group cursor-pointer relative rounded-2xl overflow-hidden"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Desktop Layout (2x2 with overlay) */}
                <div className="hidden md:block">
                  <div className="aspect-[16/10] relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {product.discount && (
                      <span className="absolute top-4 right-4 z-10 bg-primary/80 backdrop-blur-sm text-primary-foreground text-[10px] tracking-[0.15em] px-4 py-1.5 rounded-full font-medium uppercase">
                        {product.discount}% OFF
                      </span>
                    )}

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/85 to-transparent pt-28 pb-6 px-5">
                      <div className="flex items-end justify-between">
                        <div>
                          <h3 className="font-display text-2xl lg:text-3xl text-foreground tracking-wide mb-1">
                            {product.name}
                          </h3>
                          <div className="flex items-baseline gap-3">
                            <span className="text-foreground font-semibold text-xl">
                              {formatCurrency(product.price, product.currencyCode)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-muted-foreground line-through text-sm">
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
                          className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/90 shadow-lg transform translate-y-2 group-hover:translate-y-0"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout (Original style) */}
                <div className="md:hidden">
                  <div className="relative rounded-xl overflow-hidden aspect-square bg-card mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {product.discount && (
                      <span className="absolute top-2.5 left-2.5 z-10 bg-primary text-primary-foreground text-[10px] font-semibold px-2.5 py-1 rounded-md">
                        {product.discount}% OFF
                      </span>
                    )}

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        void addItem(product);
                      }}
                      className="absolute bottom-2.5 right-2.5 z-10 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>

                  <h3 className="font-display text-base text-foreground tracking-wide uppercase">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-primary font-bold text-sm">
                      {formatCurrency(product.price, product.currencyCode)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through text-xs">
                        {formatCurrency(product.originalPrice, product.currencyCode)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">No products founds found.</div>
        )}
      </div>
    </section>
  );
};

export default MostCoveted;
