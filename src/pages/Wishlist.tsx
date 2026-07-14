import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag, Trash2, Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatCurrency } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { Reveal } from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl text-foreground tracking-tight mb-4">
            Saved Items
          </h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-2xl bg-card/20 backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Star className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-display text-foreground mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Save your favorite items here to review and purchase them later.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground rounded-md px-8 py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-primary/90 transition-all shadow-md"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <Reveal key={product.id}>
                <div className="group bg-card/40 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)] relative">
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-red-400 hover:bg-black/60 transition-all"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div
                    className="relative overflow-hidden aspect-square cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3
                      className="font-display text-lg text-foreground mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-1"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/30">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-foreground tracking-tight">
                          {formatCurrency(product.price, product.currencyCode)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void addItem(product);
                        }}
                        className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95"
                        aria-label="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Wishlist;
