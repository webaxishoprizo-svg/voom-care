import { motion } from "framer-motion";
import { products } from "@/data/products";

const ProductGrid = () => (
  <section id="collections" className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">The Elite Edit</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">Most Coveted</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-lg bg-secondary aspect-square mb-3">
              {product.discount && (
                <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-semibold">
                  {product.discount}% OFF
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                width={800}
                height={800}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors" />
              <button className="absolute bottom-3 right-3 bg-primary text-primary-foreground text-xs px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                + Add
              </button>
            </div>
            <h4 className="font-display text-lg text-foreground">{product.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-primary font-semibold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductGrid;
