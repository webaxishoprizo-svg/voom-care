import { motion } from "framer-motion";
import heroMask from "@/assets/hero-mask.jpg";

const CTASection = () => (
  <section className="py-16 px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mx-auto relative rounded-3xl overflow-hidden aspect-[3/4] md:aspect-[16/10] flex flex-col items-center justify-center"
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

        <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-10">
          Ready to<br />Elevate Your<br />Drive?
        </h2>

        <a
          href="#collections"
          className="inline-block px-10 py-4 bg-foreground text-background rounded-full text-sm tracking-wider font-medium hover:bg-foreground/90 transition-colors"
        >
          Explore All Collections
        </a>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
