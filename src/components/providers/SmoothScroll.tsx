"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useMotionValue } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Expose a motion value so Framer Motion's useScroll stays in sync with Lenis
  const lenisScrollY = useMotionValue(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Keep Framer Motion's scroll tracking in sync with Lenis's virtual scroll
    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      lenisScrollY.set(scroll);
      // Also update window.scrollY so Framer Motion's useScroll reads correctly
      window.dispatchEvent(new Event("scroll"));
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Re-measure scroll height whenever document body resizes
    // (images loading, animations expanding, fonts rendering)
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      lenis.destroy();
    };
  }, [lenisScrollY]);

  return <>{children}</>;
}
