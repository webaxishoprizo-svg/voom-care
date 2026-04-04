import { motion } from "framer-motion";
import { products } from "@/data/products";

const FeaturedProducts = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto space-y-20">
      {products.slice(0, 3).map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center`}
        >
          <div className="flex-1 space-y-4">
            <p className="text-xs tracking-[0.3em] uppercase text-primary">NEW EXCLUSIVE</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">{product.name}</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-primary font-semibold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">{product.description}</p>
            <div className="flex gap-4 pt-2">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs tracking-wider text-primary">✦ {tag}</span>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <a href="#" className="px-6 py-3 border border-foreground/30 rounded-full text-foreground text-sm tracking-widest uppercase hover:bg-foreground/5 transition-colors">
                View Details
              </a>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            {product.discount && (
              <span className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-sm px-3 py-1 rounded font-semibold">
                {product.discount}% OFF
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              className="w-full rounded-xl"
            />
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeaturedProducts;
