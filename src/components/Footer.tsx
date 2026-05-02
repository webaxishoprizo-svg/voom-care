import { Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useHybridCollections } from "@/lib/shopify/hooks";

const Footer = () => {
  const { data: collections } = useHybridCollections();

  // Filter out any internal collections like hero slider
  const shopCollections = collections?.filter(c => 
    !c.handle.toLowerCase().includes('hero') && 
    !c.handle.toLowerCase().includes('hidden') &&
    !c.handle.toLowerCase().includes('home') &&
    !c.title.toLowerCase().includes('home')
  ) || [];

  return (
    <footer className="relative bg-[#080808] border-t border-white/5 pt-20 pb-10 overflow-hidden mt-20">
      {/* Background Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-50" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" aria-label="VOOM home" className="inline-flex items-center gap-4 group">
              <img src={logo} alt="VOOM" className="h-12 w-auto group-hover:scale-110 transition-transform duration-500" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Premium car care crafted in India by Frenzo Group. Professional-grade formulas for a true showroom finish.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/voom.care" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:info.frenzogp@gmail.com" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold text-xs tracking-widest uppercase mb-6">Shop</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              {shopCollections.map((collection) => (
                <li key={collection.id}>
                  <Link 
                    to={`/products?collection=${collection.handle}`} 
                    className="hover:text-primary transition-colors duration-300"
                  >
                    {collection.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold text-xs tracking-widest uppercase mb-6">Company</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors duration-300">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors duration-300">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors duration-300">Contact</Link></li>
              <li><Link to="/track-order" className="hover:text-primary transition-colors duration-300">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold text-xs tracking-widest uppercase mb-6">Legal</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-primary transition-colors duration-300">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-primary transition-colors duration-300">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-primary transition-colors duration-300">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-[10px] tracking-wide uppercase">
          <p>© {new Date().getFullYear()} VOOM by Frenzo Group. All rights reserved.</p>
          <p>Shine beyond ordinary — Made in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
