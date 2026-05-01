import { useState } from "react";
import { Menu, Search, User, ShoppingBag, X, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { SHOPIFY_ACCOUNT_URL, SHOPIFY_ORDERS_URL, SHOPIFY_LOGIN_URL } from "@/lib/shopify/client";
import logo from "@/assets/logo.png";
import SearchDialog from "@/components/SearchDialog";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, logout } = useCustomerAuth();
  const navigate = useNavigate();

  const handleAccountClick = (e: React.MouseEvent) => {
    // We use onMouseDown for instant response (saves ~100ms over onClick)
    if (e.type === 'mousedown' || e.type === 'touchstart') {
      window.location.href = isAuthenticated ? SHOPIFY_ACCOUNT_URL : SHOPIFY_LOGIN_URL;
    }
  };

  const menuItems = [
    { label: "Home", href: "/", external: false },
    { label: "Products", href: "/products", external: false },
    { label: "FAQ", href: "/faq", external: false },
    { label: "About Us", href: "/about", external: false },
    { label: "Track My Order", href: "/track-order", external: false },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 lg:px-3 lg:py-2">
        <div className="max-w-7xl lg:max-w-4xl mx-auto flex items-center justify-between bg-surface-glass rounded-full px-6 py-4 lg:px-5 lg:py-2.5 relative border border-white/5 shadow-2xl shadow-black/40">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-foreground text-[13px] font-medium tracking-wide z-10 group"
          >
            <span className="hidden sm:inline">Menu</span>
            <div className="flex flex-col gap-1 w-6 items-start">
              <div className="h-0.5 w-full bg-current transition-all duration-300" />
              <div className="h-0.5 w-[75%] bg-current transition-all duration-300" />
              <div className="h-0.5 w-[50%] bg-current transition-all duration-300" />
            </div>
          </button>

          <Link to="/" aria-label="VOOM home" className="shrink-0 absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
            <img src={logo} alt="VOOM" className="h-12 w-auto sm:h-14" />
          </Link>

          <div className="flex items-center gap-4 z-10">
            <Search onClick={() => setSearchOpen(true)} className="w-5 h-5 text-foreground/70 hover:text-foreground cursor-pointer transition-colors" />
            <button
              onMouseDown={handleAccountClick}
              className="hidden sm:block outline-none"
              aria-label={isAuthenticated ? "Open account" : "Login"}
            >
              <User className={`w-5 h-5 transition-colors ${isAuthenticated ? "text-primary" : "text-foreground/70 hover:text-foreground"}`} />
            </button>
            <button onClick={() => setIsOpen(true)} className="relative">
              <ShoppingBag className="w-5 h-5 text-foreground/70 hover:text-foreground cursor-pointer transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 z-[61] w-[75%] max-w-[360px] bg-background/80 backdrop-blur-xl border-r border-white/10 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5">
                <div className="flex items-center gap-4">
                <img src={logo} alt="VOOM" className="h-10 w-auto" />
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col px-6 py-4 gap-1 flex-1 overflow-y-auto">
                {menuItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-2xl text-foreground hover:text-primary transition-colors py-4 border-b border-border/20"
                      href={item.href}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-2xl text-foreground hover:text-primary transition-colors py-4 border-b border-border/20"
                      to={item.href}
                    >
                      {item.label}
                    </Link>
                  ),
                )}

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onMouseDown={(e) => {
                        setMenuOpen(false);
                        handleAccountClick(e);
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-glass border border-white/10 hover:border-primary/50 transition-colors"
                      aria-label="Account"
                    >
                      <User className={`w-6 h-6 ${isAuthenticated ? "text-primary" : "text-foreground"}`} />
                    </button>
                    <a
                      href={SHOPIFY_ORDERS_URL}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-glass border border-white/10 hover:border-primary/50 transition-colors"
                      aria-label="Orders"
                    >
                      <Package className="w-6 h-6 text-foreground" />
                    </a>
                  </div>

                  <button
                    onMouseDown={() => {
                      setMenuOpen(false);
                      if (isAuthenticated) {
                        logout();
                      } else {
                        window.location.href = SHOPIFY_LOGIN_URL;
                      }
                    }}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-display text-sm tracking-widest uppercase transition-all active:scale-[0.98] ${isAuthenticated
                        ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                        : "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:opacity-90"
                      }`}
                  >
                    {isAuthenticated ? "Logout" : "Login"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navbar;
