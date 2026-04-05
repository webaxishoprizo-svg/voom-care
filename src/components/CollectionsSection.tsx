import { motion } from "framer-motion";
import collectionBestseller from "@/assets/collection-bestseller.jpg";
import collectionNew from "@/assets/collection-newarrival.jpg";
import heroAqua from "@/assets/hero-aqua.jpg";

const CollectionsSection = () => (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-2">The Signature Series</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground">Explore Our Collections</h2>
      </div>

      {/* Top row — two cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { title: "Best Seller", image: collectionBestseller },
          { title: "New Arrival", image: collectionNew, comingSoon: false },
        ].map((col, i) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.45 }}
            className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer"
          >
            <img
              src={col.image}
              alt={col.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-background/30" />

            {col.comingSoon && (
              <span className="absolute top-3 right-3 z-10 bg-muted/60 backdrop-blur-sm text-foreground text-[9px] tracking-[0.15em] uppercase px-3 py-1 rounded-md font-medium">
                Coming Soon
              </span>
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-primary/20 backdrop-blur-sm border border-primary/30 text-foreground font-display text-lg md:text-xl tracking-wider uppercase px-6 py-2.5 rounded-md">
                {col.title}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom — full-width card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.45 }}
        className="group relative overflow-hidden rounded-xl aspect-[16/10] cursor-pointer"
      >
        <img
          src={heroAqua}
          alt="All Collections"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-background/30" />

        <span className="absolute top-3 right-3 z-10 bg-muted/60 backdrop-blur-sm text-foreground text-[9px] tracking-[0.15em] uppercase px-3 py-1 rounded-md font-medium">
          Coming Soon
        </span>

        <div className="absolute inset-0 flex items-end justify-center pb-6">
          <span className="bg-primary/20 backdrop-blur-sm border border-primary/30 text-foreground font-display text-lg md:text-xl tracking-wider uppercase px-8 py-2.5 rounded-md">
            Accessories
          </span>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CollectionsSection;
