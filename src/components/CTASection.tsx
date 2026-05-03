import { motion } from "framer-motion";
import heroMask from "@/assets/hero-mask.jpg";

const CTASection = () => (
  <section className="py-16 px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto relative rounded-md overflow-hidden aspect-[3/4] md:aspect-[16/10] flex flex-col items-center justify-center"
    >
      {/* Background image */}
      <img
        src={heroMask}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-6 h-px bg-primary" />
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-medium">
            Pure Sophistication
          </p>
        </div>

        <h2 className="font-display text-3xl md:text-5xl text-foreground leading-[1.1] tracking-tight mb-10">
          Ready to<br />Shine Your<br />Car?
        </h2>

        <a
          href="#collections"
          className="inline-block px-8 py-3.5 bg-foreground text-background rounded-md text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-foreground/90 transition-colors"
        >
          Explore Voom
        </a>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
