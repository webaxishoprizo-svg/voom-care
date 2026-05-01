import { motion } from "framer-motion";

const features = [
  { title: "Instant Results", desc: "See the difference from the very first use — no layering or buffing required." },
  { title: "Paint Safe", desc: "pH balanced and scratch-free formulas safe for all paint types and ceramic coatings." },
  { title: "Pro-Grade Power", desc: "The same formulas trusted by professional detailers, now made for home use." },
];

const stats = [
  { value: "12K+", label: "Happy Customers" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "100%", label: "Pro-Grade Formulas" },
  { value: "24h", label: "Fast Delivery" },
];

const ExperienceSection = () => (
  <section className="py-20 px-4 bg-secondary/30">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Why VOOM</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">
          More Than <em>Just a Wash.</em>
        </h2>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Our formulas aren&apos;t just soap. They&apos;re precision-engineered to protect and enhance your vehicle&apos;s finish — built for enthusiasts, trusted by professionals.
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
