import { motion } from "framer-motion";
import { products } from "@/data/products";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const MostCoveted = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
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
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative rounded-xl overflow-hidden aspect-square bg-card mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {product.discount && (
                  <span className="absolute top-2.5 left-2.5 z-10 bg-primary text-primary-foreground text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-md">
                    {product.discount}% OFF
                  </span>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); addItem(product); }}
                  className="absolute bottom-2.5 right-2.5 z-10 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <h3 className="font-display text-base md:text-lg text-foreground tracking-wide uppercase">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-primary font-bold text-sm md:text-base">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through text-xs">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostCoveted;
