import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
  <main className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-foreground text-center mb-4">
          Our Collection
        </h1>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
          Discover our range of luxury car fragrances, each crafted with 100% natural oils for an unforgettable driving experience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg text-foreground mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground text-xs line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </main>
);

export default Products;
