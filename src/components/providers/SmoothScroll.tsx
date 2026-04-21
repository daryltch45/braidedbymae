"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useMotionValue } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisScrollY = useMotionValue(0);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function initLenis() {
      // Tear down any existing instance before creating a new one
      if (lenisRef.current) {
        cancelAnimationFrame(rafRef.current);
        lenisRef.current.destroy();
      }

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ({ scroll }: { scroll: number }) => {
        lenisScrollY.set(scroll);
        window.dispatchEvent(new Event("scroll"));
      });

      function raf(time: number) {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
      rafRef.current = requestAnimationFrame(raf);

      const resizeObserver = new ResizeObserver(() => lenis.resize());
      resizeObserver.observe(document.body);
      return resizeObserver;
    }

    const resizeObserver = initLenis();

    // Reinitialize when page is restored from bfcache (browser Back button)
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) initLenis();
    }
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      lenisRef.current?.destroy();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [lenisScrollY]);

  return <>{children}</>;
}
