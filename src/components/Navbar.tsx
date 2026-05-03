import { useState, useEffect } from "react";
import { Menu, Search, User, ShoppingBag, X, Package, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { SHOPIFY_ACCOUNT_URL, SHOPIFY_ORDERS_URL, SHOPIFY_LOGIN_URL } from "@/lib/shopify/client";
import logo from "@/assets/logo.png";
import SearchDialog from "@/components/SearchDialog";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAccountClick = (e: React.MouseEvent) => {
    if (e.type === 'mousedown' || e.type === 'touchstart') {
      window.location.href = isAuthenticated ? SHOPIFY_ACCOUNT_URL : SHOPIFY_LOGIN_URL;
    }
  };

  const menuItems = [
    { label: "Home", href: "/", external: false },
    { label: "Combo", href: "/products?collection=compo", external: false },
    { label: "About Us", href: "/about", external: false },
    { label: "FAQ", href: "/faq", external: false },
    { label: "Track My Order", href: "/track-order", external: false },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-transparent py-3 px-4 md:px-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between lg:border lg:border-white/10 lg:rounded-full lg:px-10 lg:py-1.5 bg-transparent">
          {/* Desktop Left: Nav Links */}
          <div className="hidden lg:flex items-center gap-2 flex-1">
            {menuItems.slice(0, 3).map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-5 py-2 rounded-full text-[13px] font-medium tracking-wide text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all backdrop-blur-sm border border-transparent hover:border-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile: Hamburger */}
          <div className="lg:hidden flex-1">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 text-foreground/80 hover:text-foreground transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="shrink-0 flex items-center justify-center relative w-32 md:w-52 h-10 md:h-12">
            <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img src={logo} alt="VOOM" className="h-16 md:h-22 w-auto object-contain max-w-none" />
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center justify-end gap-2 md:gap-5 flex-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-transparent backdrop-blur-xl text-foreground/80 hover:text-foreground transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onMouseDown={handleAccountClick}
              className="hidden md:flex p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-transparent backdrop-blur-xl text-foreground/80 hover:text-foreground transition-all"
              aria-label="Account"
            >
              <User className={`w-5 h-5 ${isAuthenticated ? "text-primary" : ""}`} />
            </button>

            <button
              className="hidden md:flex p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-transparent backdrop-blur-xl text-foreground/80 hover:text-foreground transition-all"
              aria-label="Save"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 p-2.5 md:px-4 md:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-transparent backdrop-blur-xl transition-all group"
            >
              <ShoppingBag className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors" />
              <span className="hidden md:inline text-[12px] font-bold tracking-wider text-foreground/80 group-hover:text-foreground">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[61] w-[85%] max-w-[400px] bg-background flex flex-col"
            >
              <div className="flex items-center justify-between p-5">
                <img src={logo} alt="VOOM" className="h-10 w-auto" />
                <button onClick={() => setMenuOpen(false)} className="p-2 -mr-2">
                  <X className="w-5.5 h-5.5 text-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-2xl font-semibold tracking-tight text-foreground hover:text-primary transition-all py-2.5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="p-6 bg-secondary/10">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onMouseDown={(e) => {
                      setMenuOpen(false);
                      handleAccountClick(e);
                    }}
                    className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2.5 text-[13px] text-foreground font-medium"
                  >
                    <User className="w-4.5 h-4.5" />
                    Account
                  </button>
                  <a
                    href={SHOPIFY_ORDERS_URL}
                    className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-2.5 text-[13px] text-foreground font-medium"
                  >
                    <Package className="w-4.5 h-4.5" />
                    Orders
                  </a>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (isAuthenticated) logout();
                    else window.location.href = SHOPIFY_LOGIN_URL;
                  }}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase text-[10px]"
                >
                  {isAuthenticated ? "Logout" : "Login / Register"}
                </button>
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

