import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scrolling — desktop only.
 * Disabled on touch devices and when the user prefers reduced motion to keep
 * mobile scrolling native and snappy.
 */
const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    const lenis = new Lenis({
      // Slightly longer duration with a buttery exponential ease for premium feel
      duration: 1.5,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Enable Lenis touch smoothing for extreme smoothness on mobile
      syncTouch: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2,
      lerp: 0.07,
      infinite: false,
    });

    const resizeObserver = new ResizeObserver(() => lenis.resize());
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
