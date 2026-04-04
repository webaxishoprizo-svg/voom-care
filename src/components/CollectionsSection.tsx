import { motion } from "framer-motion";
import collectionBestseller from "@/assets/collection-bestseller.jpg";
import collectionNew from "@/assets/collection-newarrival.jpg";

const collections = [
  { title: "Best Seller", subtitle: "NOR — EXPLORER", image: collectionBestseller },
  { title: "New Arrival", subtitle: "NOR — EXPLORER", image: collectionNew },
];

const CollectionsSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">The Signature Series</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">Explore Our Collections</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {collections.map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer"
          >
            <img
              src={col.image}
              alt={col.title}
              loading="lazy"
              width={800}
              height={1000}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{col.subtitle}</p>
              <h3 className="font-display text-2xl text-foreground mb-3">{col.title}</h3>
              <span className="text-primary text-sm tracking-wider">Discover Scene ›</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CollectionsSection;
