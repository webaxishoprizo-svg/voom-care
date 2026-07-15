import { Instagram, Mail } from "lucide-react";
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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

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
              href="https://wa.me/919187331513?text=Hi%20VOOM%20Care,%20I%20have%20a%20question%20about%20your%20products!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-500"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:support@voomcare.com"
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
            <p className="text-[10px] text-white/55 tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} VOOM · Frenzo Group
            </p>
            <p className="text-[9px] text-white/35 tracking-[0.1em] uppercase text-center md:text-right">
              Handcrafted Car Care · Made in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
