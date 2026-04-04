import { motion } from "framer-motion";

const CTASection = () => (
  <section className="py-24 px-4 text-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto"
    >
      <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Pure Sophistication</p>
      <h2 className="font-display text-4xl md:text-6xl text-foreground mb-8">
        Ready to Elevate Your Drive?
      </h2>
      <a
        href="#collections"
        className="inline-block px-10 py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-widest uppercase font-semibold hover:bg-primary/90 transition-colors"
      >
        Explore All Collections
      </a>
    </motion.div>
  </section>
);

export default CTASection;
