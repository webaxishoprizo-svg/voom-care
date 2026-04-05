import { Instagram, Facebook, Linkedin } from "lucide-react";
import norLogo from "@/assets/nor-logo.jpg";

const Footer = () => (
  <footer className="border-t border-border py-12 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div>
          <img src={norLogo} alt="NOR" className="h-12 w-auto mb-4" />
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
            <li><a href="/products" className="hover:text-primary transition-colors">All Products</a></li>
            <li><a href="/products" className="hover:text-primary transition-colors">Best Sellers</a></li>
            <li><a href="/products" className="hover:text-primary transition-colors">New Arrivals</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold text-sm tracking-wider uppercase mb-4">Company</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
            <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            <li><a href="/track-order" className="hover:text-primary transition-colors">Track Order</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold text-sm tracking-wider uppercase mb-4">Legal</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li><a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</a></li>
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
