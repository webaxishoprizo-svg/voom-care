import { Instagram, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t border-border py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <Link to="/" aria-label="NOR home" className="mb-4 inline-flex items-center gap-3">
            <img src={logo} alt="NOR" className="h-12 w-auto" />
            <span className="font-display text-xl text-foreground">NOR perfume</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Luxury car fragrances crafted in India with 100% natural oils.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-foreground font-semibold text-sm tracking-wider uppercase mb-4">Shop</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              <Link to="/products?collection=all-collection" className="hover:text-primary transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/products?collection=best-seller" className="hover:text-primary transition-colors">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link to="/products?collection=new-arrival" className="hover:text-primary transition-colors">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold text-sm tracking-wider uppercase mb-4">Company</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link to="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold text-sm tracking-wider uppercase mb-4">Legal</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link to="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border pt-8 text-center text-muted-foreground text-xs">
        © {new Date().getFullYear()} NOR. All rights reserved. Crafted in India.
      </div>
    </div>
  </footer>
);

export default Footer;
