import { Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/products?collection=compo", label: "Combo" },
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
  { to: "/track-order", label: "Track Order" },
];

const legalLinks = [
  { to: "/privacy-policy", label: "Privacy" },
  { to: "/terms-of-service", label: "Terms" },
  { to: "/refund-policy", label: "Refund" },
  { to: "/shipping-policy", label: "Shipping" },
];

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-white/5 pt-4 pb-6 md:pt-10 md:pb-8 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-primary/[0.05] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center text-center mb-8 md:mb-10">
          {/* Large Logo */}
          <Link to="/" aria-label="VOOM home" className="mb-0 group">
            <img
              src={logo}
              alt="VOOM"
              className="h-22 md:h-28 w-auto object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-medium mb-3 md:mb-5">
            Shine Beyond Ordinary
          </p>

          {/* Straight Horizontal Links */}
          <nav className="flex flex-wrap justify-center gap-x-5 md:gap-x-6 gap-y-2.5 mb-6 md:mb-8">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-[11px] font-semibold text-white/60 hover:text-white tracking-[0.15em] uppercase transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons - Premium Style */}
          <div className="flex items-center gap-5 mb-8 md:mb-10">
            <a
              href="https://www.instagram.com/voom.care"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-500"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-500"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="mailto:info.frenzogp@gmail.com"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-500"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar: Legal + Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[10px] text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:items-end gap-1">
            <p className="text-[10px] text-white/20 tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} VOOM · Frenzo Group
            </p>
            <p className="text-[9px] text-white/10 tracking-[0.1em] uppercase text-center md:text-right">
              Handcrafted Car Care · Made in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
