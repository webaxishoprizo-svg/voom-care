import { Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const companyLinks = [
  { to: "/about", label: "About" },
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
    <footer className="relative bg-[#080808] border-t border-white/5 mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-14 pb-8">
        {/* Top: Brand + Socials */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-10 border-b border-white/5">
          <Link to="/" aria-label="VOOM home" className="inline-flex items-center gap-3 group">
            <img src={logo} alt="VOOM" className="h-10 w-auto group-hover:scale-105 transition-transform duration-500" />
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/voom.care"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-md border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-md border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="mailto:info.frenzogp@gmail.com"
              aria-label="Email"
              className="w-9 h-9 rounded-md border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-white/30 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Link rows */}
        <div className="py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-medium sm:w-24 shrink-0">
              Company
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {companyLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-medium sm:w-24 shrink-0">
              Legal
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-muted-foreground/70 text-[10px] tracking-[0.2em] uppercase">
          <p>© {new Date().getFullYear()} VOOM · Frenzo Group</p>
          <p>Shine Beyond Ordinary — Made in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
