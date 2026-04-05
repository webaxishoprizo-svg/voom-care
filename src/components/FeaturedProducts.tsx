import { motion } from "framer-motion";
import { products } from "@/data/products";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => (
  <section className="py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-1">New Exclusive</p>
        <h2 className="font-display text-3xl md:text-5xl text-foreground font-bold">
          OUR<br />COLLECTION
        </h2>
      </div>

      <div className="space-y-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-2xl overflow-hidden border border-border/30 group"
          >
            {/* Product image */}
            <div className="aspect-[4/5] md:aspect-[16/9] relative">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Discount badge */}
              {product.discount && (
                <span className="absolute top-4 right-4 z-10 bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs tracking-widest px-4 py-1.5 rounded-full font-medium uppercase">
                  {product.discount}% OFF
                </span>
              )}

              {/* Bottom overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-24 pb-5 px-5">
                <h3 className="font-display text-2xl md:text-3xl text-foreground mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-foreground font-semibold text-lg">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground line-through text-sm">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <button className="bg-foreground text-background px-8 py-3 text-sm tracking-[0.15em] uppercase font-medium hover:bg-foreground/90 transition-colors">
                    Add to Cart
                  </button>
                  <button className="w-12 h-12 border border-foreground/30 flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
