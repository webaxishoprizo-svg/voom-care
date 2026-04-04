import { useState } from "react";
import { Menu, Search, User, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-surface-glass rounded-full px-6 py-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-foreground text-sm tracking-widest uppercase"
          >
            <span className="hidden sm:inline">Menu</span>
            <Menu className="w-5 h-5" />
          </button>

          <a href="/" className="font-display text-2xl font-bold tracking-wider text-foreground">
            NOR
          </a>

          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-foreground/70 hover:text-foreground cursor-pointer transition-colors" />
            <User className="w-5 h-5 text-foreground/70 hover:text-foreground cursor-pointer transition-colors hidden sm:block" />
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-foreground/70 hover:text-foreground cursor-pointer transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                0
              </span>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-foreground"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col items-center gap-8">
              {["Home", "Products", "About Us", "Track My Order"].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-4xl md:text-5xl text-foreground hover:text-primary transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
