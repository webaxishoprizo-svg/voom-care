import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ duration: 0.3 }}
          href="https://wa.me/919187331513?text=Hi%20VOOM%20Care,%20I%20have%20a%20question%20about%20your%20products!"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#161616] text-muted-foreground border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 hover:text-foreground hover:bg-[#222222] hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Contact support on WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="currentColor"
          >
            <path d="M12.031 2c-5.514 0-9.969 4.457-9.969 9.968 0 1.758.459 3.473 1.33 4.98L2 22l5.222-1.371c1.455.793 3.09 1.21 4.796 1.21 5.515 0 9.982-4.467 9.982-9.97C22.001 6.457 17.546 2 12.031 2zm0 17.37c-1.536 0-3.05-.412-4.385-1.193l-.315-.187-3.262.856.87-3.18-.205-.327c-.854-1.363-1.306-2.946-1.306-4.57 0-4.636 3.782-8.414 8.419-8.414 4.634 0 8.423 3.778 8.423 8.414 0 4.638-3.783 8.416-8.424 8.416z" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
