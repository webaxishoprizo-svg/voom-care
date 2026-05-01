import { motion } from "framer-motion";

const stats = [
  { value: "50K+", label: "Elite Customers" },
  { value: "100%", label: "Lab Tested" },
  { value: "24/7", label: "Professional Care" },
  { value: "Premium", label: "Indian Quality" },
];

const BrandStats = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-display text-primary mb-2 italic">
                {stat.value}
              </div>
              <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStats;
