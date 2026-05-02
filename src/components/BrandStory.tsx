import { motion } from "framer-motion";
import { ShieldCheck, Zap, Droplets } from "lucide-react";

const BrandStory = () => {
  return (
    <section className="py-32 px-4 bg-[#050505] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <p className="text-primary text-xs tracking-[0.4em] uppercase font-bold">The Voom Standard</p>
              <h2 className="font-display text-5xl md:text-7xl text-white italic tracking-tighter leading-[1.1]">
                Engineered for <br />
                <span className="text-primary">the 1%</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed max-w-lg font-light tracking-wide">
                <span className="md:hidden">Luxury chemistry perfected for your vehicle's ultimate protection.</span>
                <span className="hidden md:inline">Luxury isn't just about the look; it's about the chemistry. We've spent years in the lab perfecting a surface-safe formula that defies the elements.</span>
              </p>
            </div>

            <div className="hidden md:grid sm:grid-cols-2 gap-8 pt-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold tracking-widest uppercase text-[10px]">Surface Safe Tech</h4>
                <p className="text-white/30 text-xs leading-relaxed">Advanced surface-safe technology that cleans without damage.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-white font-bold tracking-widest uppercase text-[10px]">Paint Protection</h4>
                <p className="text-white/30 text-xs leading-relaxed">PH-balanced formulas designed to preserve your vehicle's factory shine.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
              <img 
                src="https://images.unsplash.com/photo-1593441712329-c4d15f62da18?auto=format&fit=crop&q=80&w=2000" 
                alt="Laboratory testing" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
            
            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 md:-left-20 p-8 rounded-3xl glass-card border border-white/10 shadow-2xl z-20 hidden md:block"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white">
                  <Droplets className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-white font-bold text-2xl tracking-tighter italic">Pro Formulas</p>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase">100% Quality Inspected</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
