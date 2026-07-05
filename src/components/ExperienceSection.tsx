import { motion } from "framer-motion";
import { Shield, Sparkles, Zap, Award, Flame, Paintbrush } from "lucide-react";
import { Reveal } from "@/components/ScrollReveal";

const features = [
  {
    icon: Paintbrush,
    title: "Paint Safe Formulas",
    desc: "pH balanced, biodegradable, and scratch-free formulas safe for all paint types, clear coats, and ceramic coatings."
  },
  {
    icon: Sparkles,
    title: "Mirror Finish Gloss",
    desc: "Achieve a professional, high-gloss showroom shine at home with our advanced optical reflection enhancers."
  },
  {
    icon: Shield,
    title: "Pro-Grade Protection",
    desc: "Advanced protective barrier defense that shields surfaces against harsh UV rays, road salt, rain, and heat."
  },
  {
    icon: Zap,
    title: "Instant Results",
    desc: "Engineered for detailing enthusiasts who value time and efficiency without compromising on uncompromising excellence."
  },
  {
    icon: Award,
    title: "Crafted for India",
    desc: "Premium grade car care formulations specifically engineered and tested to combat Indian road conditions and climate."
  },
  {
    icon: Flame,
    title: "Slick Hydrophobic Action",
    desc: "Creates an ultra-slick surface tension causing water, mud, and dust to bead up and slide off immediately."
  }
];

const stats = [
  { value: "500+", label: "Happy Customers" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "100%", label: "Lab Tested" },
  { value: "24/7", label: "Professional Care" },
];

const ExperienceSection = () => (
  <Reveal>
    <section className="py-20 px-4 bg-[#0d0d0d] relative overflow-hidden border-y border-white/5">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Why VOOM</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            More Than <em>Just a Wash.</em>
          </h2>
          <p className="mt-6 text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Our formulas aren&apos;t just soap. They&apos;re precision-engineered to protect and enhance your vehicle&apos;s finish — built for enthusiasts, trusted by professionals.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card/45 backdrop-blur-sm border border-border/40 rounded-2xl p-6 md:p-8 hover:border-primary/20 hover:bg-card/65 transition-all duration-500 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg md:text-xl text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-border/30">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl text-primary">{s.value}</p>
              <p className="text-muted-foreground text-[10px] tracking-widest uppercase mt-3">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Reveal>
);

export default ExperienceSection;
