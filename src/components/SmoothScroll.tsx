import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scrolling — desktop only.
 * Disabled on touch devices and when the user prefers reduced motion to keep
 * mobile scrolling native and snappy.
 */
const SmoothScroll = () => {
  useEffect(() => {
    // Skip on reduced-motion, touch devices, and small screens — native scroll is faster there
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.innerWidth < 1024) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Keep Lenis in sync with layout changes (fixes "stuck" scroll)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
