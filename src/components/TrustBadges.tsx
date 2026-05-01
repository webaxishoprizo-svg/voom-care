import { Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { 
    icon: Truck, 
    label: "Express Shipping", 
    sublabel: "Across India",
    delay: 0.1 
  },
  { 
    icon: ShieldCheck, 
    label: "Secure Checkouts", 
    sublabel: "100% Protected",
    delay: 0.2 
  },
  { 
    icon: RefreshCw, 
    label: "Easy Returns", 
    sublabel: "Hassle-free",
    delay: 0.3 
  },
];

const TrustBadges = () => (
  <div className="py-8 md:py-12 border-y border-white/5 bg-black/10 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-3 gap-2 md:gap-12">
        {badges.map(({ icon: Icon, label, sublabel, delay }) => (
          <motion.div 
            key={label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 group"
          >
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
              <Icon className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 text-primary" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-[8px] md:text-xs font-bold text-foreground tracking-tight md:tracking-wide uppercase leading-tight">{label}</h4>
              <p className="hidden md:block text-[10px] text-muted-foreground mt-0.5 tracking-wider uppercase font-medium">{sublabel}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default TrustBadges;

