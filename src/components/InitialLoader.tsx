import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/voom-logo.png";

const SESSION_KEY = "voom_initial_loader_shown";
const MIN_DURATION = 1600; // ms — let the animation breathe

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
      // Safety net
      const safety = window.setTimeout(finish, 4000);
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
    <AnimatePresence>
      {visible && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
          aria-hidden
        >
          {/* Soft animated radial glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{
              background:
                "radial-gradient(60% 50% at 50% 50%, hsl(var(--primary) / 0.18), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-7">
            {/* Rotating ring */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                className="absolute inset-3 rounded-full border border-primary/20 border-b-primary/70"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              />

              {/* Pulsing logo */}
              <motion.img
                src={logo}
                alt="VOOM"
                initial={{ scale: 0.7, opacity: 0, filter: "blur(8px)" }}
                animate={{
                  scale: [0.95, 1.05, 0.95],
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.6, ease: "easeOut" },
                  filter: { duration: 0.6, ease: "easeOut" },
                }}
                className="relative w-16 h-16 object-contain drop-shadow-[0_0_18px_hsl(var(--primary)/0.45)]"
                draggable={false}
              />
            </div>

            {/* Brand wordmark + shimmer line */}
            <div className="flex flex-col items-center gap-3">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                className="text-[11px] tracking-[0.55em] uppercase text-foreground/70 font-light"
              >
                VOOM Care
              </motion.p>

              <div className="relative h-[2px] w-40 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ x: ["-100%", "300%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/70"
              >
                Shine Beyond Ordinary
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;
