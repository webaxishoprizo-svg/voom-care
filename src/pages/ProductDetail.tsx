import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Shield,
  Leaf,
  Clock,
  ChevronLeft,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useHybridProduct, useHybridProducts } from "@/lib/shopify/hooks";
import { formatCurrency } from "@/lib/utils";

const testimonials = [
  {
    text: "This fragrance completely elevated my daily commute. Pure luxury.",
    name: "Arjun K.",
    rating: 5,
  },
  {
    text: "Subtle, long-lasting, and beautifully crafted. Worth every rupee.",
    name: "Meera D.",
    rating: 5,
  },
  {
    text: "I get compliments every time someone sits in my car.",
    name: "Vikram P.",
    rating: 5,
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const productQuery = useHybridProduct(id);
  const catalogQuery = useHybridProducts();
  const product = productQuery.data;
  const catalog = catalogQuery.data || [];
  const recommended = catalog.filter((item) => item.id !== product?.id).slice(0, 3);

  if (!product && productQuery.isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Loading Product...</h1>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-3xl text-foreground">Product Not Found</h1>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const detailCards = [
    {
      icon: Leaf,
      title: "Fragrance Composition",
      content: product.details?.composition,
    },
    {
      icon: Clock,
      title: "How To Use",
      content: product.details?.howToUse,
    },
    {
      icon: Shield,
      title: "What's In The Box",
      content: product.details?.whatsInTheBox,
    },
  ].filter((card) => Boolean(card.content));

  const handleAddToCart = async () => {
    await addItem(product, qty);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={product.images?.[0] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.discount && (
              <span className="absolute top-4 left-4 gradient-gold text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                -{product.discount}% OFF
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="w-4 h-4 fill-primary text-primary" />
              ))}
              <span className="text-muted-foreground text-xs ml-2">(128 reviews)</span>
            </div>

            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">NOR Collection</p>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary bg-primary/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-sans text-3xl text-foreground font-semibold">
                {formatCurrency(product.price, product.currencyCode)}
              </span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-lg">
                  {formatCurrency(product.originalPrice, product.currencyCode)}
                </span>
              )}
              {product.discount && (
                <span className="text-sm font-semibold text-primary">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-foreground font-medium">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={!product.availableForSale}
                className="flex-1 h-12 gradient-gold text-primary-foreground font-semibold text-base rounded-full hover:opacity-90 transition-opacity gap-2 disabled:opacity-60"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.availableForSale ? "Add to Cart" : "Sold Out"}
              </Button>
            </div>

            {detailCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {detailCards.map((card) => (
                  <div
                    key={card.title}
                    className="bg-card border border-border rounded-xl p-4 text-center"
                  >
                    <card.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground mb-2">{card.title}</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                      {card.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-primary text-center mb-2">
            Reviews
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-10">
            What Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, ratingIndex) => (
                    <Star
                      key={ratingIndex}
                      className="w-3.5 h-3.5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-foreground/90 text-sm italic leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                <p className="text-muted-foreground text-xs font-semibold">
                  - {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {recommended.length > 0 && (
        <section className="px-4 py-16 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-primary text-center mb-2">
              You May Also Like
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground text-center mb-10">
              Recommended
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recommended.map((recommendedProduct, index) => (
                <motion.div
                  key={recommendedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    navigate(`/product/${recommendedProduct.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={recommendedProduct.image}
                      alt={recommendedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-foreground">
                      {recommendedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-primary font-semibold">
                        {formatCurrency(
                          recommendedProduct.price,
                          recommendedProduct.currencyCode,
                        )}
                      </span>
                      {recommendedProduct.originalPrice && (
                        <span className="text-muted-foreground text-xs line-through">
                          {formatCurrency(
                            recommendedProduct.originalPrice,
                            recommendedProduct.currencyCode,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default ProductDetail;
