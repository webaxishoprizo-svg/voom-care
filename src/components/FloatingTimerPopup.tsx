import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShoppingCart } from 'lucide-react';

const FloatingTimerPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [isVisible]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleBuyNow = () => window.scrollTo({ top: 800, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50, y: '-50%' }}
          animate={{ opacity: 1, x: 0, y: '-50%' }}
          exit={{ opacity: 0, x: -50, y: '-50%' }}
          className="fixed left-2 md:left-4 top-1/2 z-50 pointer-events-auto"
        >
          <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 flex flex-col items-center gap-3 shadow-2xl shadow-black max-w-[110px] md:max-w-[130px] relative overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-1000 ease-linear"
              style={{ width: \\%\ }}
            />
            <div className="flex flex-col items-center gap-1 text-center w-full z-10">
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-red-500 font-bold flex items-center justify-center gap-1 w-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Offer Ends
              </span>
              <div className="font-mono text-xl md:text-2xl font-bold text-white tracking-tighter tabular-nums drop-shadow-md">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] z-10"
            >
              <ShoppingCart className="w-3 h-3" />
              Claim Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default FloatingTimerPopup;
