import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fallbackVideo from "@/assets/voom hero veo.mp4";
import { useSiteMedia } from "@/lib/site-media";


const phrases = [
  "Showroom Finish",
  "Mirror Glow",
  "Shiny Glass",
  "Liquid Precision",
  "Ultimate Clarity",
  "Beyond Shine",
];

const positions = [
  "top-[20%] left-[10%]",
  "bottom-[25%] right-[10%]",
  "top-[45%] left-[15%]",
  "top-[15%] right-[15%]",
  "bottom-[15%] left-[10%]",
  "top-[60%] right-[10%]",
];

const MobileVideoHero = () => {
  const [index, setIndex] = useState(0);
  const { data: media } = useSiteMedia();
  const heroVideo = media?.hero_mobile_video?.media_type === 'video' ? media.hero_mobile_video : null;
  const heroImage = media?.hero_mobile_image?.media_type === 'image' ? media.hero_mobile_image : null;
  const videoSrc = heroVideo?.url || fallbackVideo;
  const posterSrc = heroVideo?.poster_url || heroImage?.url || undefined;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);


  return (
    <section className="relative h-screen w-full overflow-hidden lg:hidden bg-black">
      {/* Background Video */}
      <video
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        style={{ transform: "translateZ(0)" }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>


      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Animated Descriptions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, y: -10, filter: "blur(10px)" }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] // Custom ease for premium feel
          }}
          className={`absolute p-6 z-20 pointer-events-none ${positions[index]}`}
        >
          <div className="relative">
            {/* Background Blur Glow */}
            <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-50" />
            
            <h2 className="relative font-display italic text-[3rem] md:text-[4rem] text-white leading-tight tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {phrases[index].split(" ").map((word, i) => (
                <span key={i} className="block first:ml-0 last:ml-8">
                  {word}
                </span>
              ))}
            </h2>
            
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 1 }}
              className="h-[1px] bg-gradient-to-r from-primary to-transparent mt-2"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Branding / Scroll Indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4 z-20 px-6">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-light"
        >
          VOOM CARE • PREMIUM FORMULAS
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <a
            href="/products"
            className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[11px] font-medium tracking-widest uppercase hover:bg-white/20 transition-all"
          >
            Explore
          </a>
        </motion.div>
        <div className="h-12 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
};

export default MobileVideoHero;
