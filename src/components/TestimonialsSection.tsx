import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "MUSK NOR transformed my car into a sanctuary. Every drive feels intentional now.",
    name: "Rahul M.",
    location: "Mumbai, India",
    initial: "R",
  },
  {
    text: "I've tried many car perfumes. NOR is the only one that lasts and doesn't feel artificial. Absolutely premium.",
    name: "Priya S.",
    location: "New Delhi, India",
    initial: "P",
  },
  {
    text: "The design is so minimal and beautiful. It doesn't look out of place in my BMW interior at all.",
    name: "Siddharth V.",
    location: "Bengaluru, India",
    initial: "S",
  },
];

const TestimonialsSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">Customer Love</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">What They're Saying</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-8"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-foreground/90 italic leading-relaxed mb-6">
              "{t.text}"
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {t.initial}
              </div>
              <div>
                <p className="text-foreground font-semibold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.location}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
