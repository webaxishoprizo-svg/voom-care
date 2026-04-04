import { motion } from "framer-motion";

const features = [
  { title: "Long-lasting Release", desc: "Up to 45 days of continuous fragrance" },
  { title: "Sustainably Sourced", desc: "100% natural essential oils, ethically obtained" },
  { title: "Zero-Liquid Technology", desc: "Spill-proof ceramic core, safe for all vehicles" },
];

const stats = [
  { value: "5+", label: "Fragrances" },
  { value: "4", label: "Luxury Lines" },
  { value: "100%", label: "Natural Oil Toxin Free" },
  { value: "500+", label: "Happy Customers" },
];

const ExperienceSection = () => (
  <section className="py-20 px-4 bg-secondary/30">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">The Experience</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          More Than <em>Just a Scent.</em>
        </h2>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We believe your car is an extension of your personal sanctuary. NOR diffusers are engineered with premium
          aerospace-grade aluminum and feature a minimalist design that seamlessly integrates into luxury interiors.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <p className="font-display text-4xl md:text-5xl text-primary">{s.value}</p>
            <p className="text-muted-foreground text-sm mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceSection;
