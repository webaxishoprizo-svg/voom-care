import { motion } from "framer-motion";
import { useCollectionProducts } from "@/lib/shopify/hooks";
import { Clock, Bell } from "lucide-react";

const ComingSoonBanner = () => {
  const { data: products = [], isLoading } = useCollectionProducts("coming-soon");

  if (isLoading || !products.length) return null;

  // We'll show the first product from the coming soon collection as a featured banner
  const product = products[0];

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="grid lg:grid-cols-2 items-center">
            {/* Content Side */}
            <div className="p-10 md:p-16 lg:p-20 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Coming Soon</span>
              </div>

              <div className="space-y-4">
                <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter leading-none italic">
                  {product.name}
                </h2>
                <p className="text-white/50 text-sm md:text-lg leading-relaxed max-w-md">
                  <span className="md:hidden">The next evolution in professional car care.</span>
                  <span className="hidden md:inline">A new addition to the Signature Series. Engineered for those who demand a perfect showroom finish.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                <button className="group relative w-full sm:w-auto h-14 px-10 rounded-full bg-white text-black font-bold tracking-widest uppercase text-[10px] hover:bg-primary hover:text-white transition-all duration-500 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notify Me
                  </span>
                </button>
              </div>
            </div>

            {/* Image Side */}
            <div className="relative h-full min-h-[400px] lg:min-h-[600px] overflow-hidden">
              <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover lg:absolute lg:inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonBanner;
