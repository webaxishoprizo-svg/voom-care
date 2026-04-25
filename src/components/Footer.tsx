import { Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border/30 pt-16 pb-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">

        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" aria-label="NOR home" className="inline-flex items-center gap-4 group">
              <img src={logo} alt="NOR" className="h-10 w-auto group-hover:scale-110 transition-transform duration-500" />
              <span className="font-display text-2xl text-foreground tracking-tight">NOR perfume</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Luxury car fragrances crafted in India with 100% natural oils for those who drive with purpose.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://www.instagram.com/norperfumeofficial" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:norperfume.help@gmail.com" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold text-xs tracking-widest uppercase mb-6">Shop</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li>
                <Link to="/products?collection=all-collection" className="hover:text-primary transition-colors duration-300">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?collection=best-seller" className="hover:text-primary transition-colors duration-300">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/products?collection=new-arrival" className="hover:text-primary transition-colors duration-300">
                  New Arrivals
                </Link>
              </li>
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
          <p>© {new Date().getFullYear()} NOR PERFUME. All rights reserved.</p>
          <p>Crafted with pride in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
