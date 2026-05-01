import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Pro-Grade Protection",
    description: "Advanced ceramic-infused formulas providing long-lasting defense against elements.",
  },
  {
    icon: Sparkles,
    title: "Mirror Finish",
    description: "Achieve professional showroom shine with our proprietary gloss-enhancement technology.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Engineered for enthusiasts who value efficiency without compromising on excellence.",
  },
  {
    icon: Award,
    title: "Crafted in India",
    description: "Premium formulations developed and tested for the unique Indian environment.",
  },
];

const BrandQuality = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-medium tracking-widest uppercase mb-4"
          >
            The VOOM Standard
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display italic text-foreground mb-6"
          >
            Uncompromising Excellence
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-px bg-primary mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl border border-white/5 hover:border-primary/20 transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
};

export default BrandQuality;
