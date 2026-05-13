import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/voom-logo.png";

const SESSION_KEY = "voom_initial_loader_shown";
const MIN_DURATION = 2400; // Cinematic timing

const InitialLoader = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  });

  useEffect(() => {
    if (!visible) return;

    const start = performance.now();
    document.body.style.overflow = "hidden";

    const finish = () => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DURATION - elapsed);
      window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(false);
        document.body.style.overflow = "";
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      const safety = window.setTimeout(finish, 5000);
      return () => {
        window.removeEventListener("load", finish);
        window.clearTimeout(safety);
        document.body.style.overflow = "";
      };
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: "blur(10px)",
            transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
          aria-hidden
        >
          {/* Cinematic Background Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Soft Ambient Glows */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)"
              }}
            />
            
            {/* Animated Particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/20 rounded-full"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: Math.random() * 100 + "%",
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  opacity: 0 
                }}
                animate={{ 
                  y: ["0%", "-20%"],
                  opacity: [0, 0.4, 0],
                }}
                transition={{ 
                  duration: Math.random() * 4 + 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Content Layer */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Reveal */}
            <div className="relative mb-20">
              {/* Outer Ring */}
              <motion.div 
                className="absolute -inset-12 rounded-full border border-white/5"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Pulsing Aura */}
              <motion.div
                className="absolute inset-0 blur-3xl rounded-full bg-white/10"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "blur(12px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <img
                  src={logo}
                  alt="VOOM"
                  className="w-36 h-36 object-contain brightness-0 invert opacity-95"
                  style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.2))" }}
                />
              </motion.div>
            </div>

            {/* Brand Identity Reveal */}
            <div className="flex flex-col items-center gap-6">
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white text-3xl font-display tracking-[0.4em] uppercase"
                >
                  VOOM CARE
                </motion.h1>
              </div>

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 1.2, ease: "easeInOut" }}
                className="h-[1px] w-56 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.5 }}
                  transition={{ delay: 1.4, duration: 1 }}
                  className="text-white/80 text-[10px] tracking-[0.6em] uppercase font-light"
                >
                  Pure Performance Luxury
                </motion.p>
              </div>
            </div>
          </div>

          {/* Minimalist Progress Indicator */}
          <div className="absolute bottom-24 w-48 flex flex-col items-center gap-3">
            <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 w-1/3 bg-white/40"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ 
                  duration: 2.2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;

