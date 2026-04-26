"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const isDispatchingRef = useRef(false);
  const pathname = usePathname();

  const initLenis = useCallback(() => {
    if (lenisRef.current) {
      cancelAnimationFrame(rafRef.current);
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      if (isDispatchingRef.current) return;
      isDispatchingRef.current = true;
      window.dispatchEvent(new Event("scroll"));
      isDispatchingRef.current = false;
    });

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    initLenis();

    const resizeObserver = new ResizeObserver(() => {
      lenisRef.current?.resize();
    });
    resizeObserver.observe(document.body);

    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) initLenis();
    }
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      lenisRef.current?.destroy();
      lenisRef.current = null;
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [initLenis]);

  // Reinitialize Lenis on route change (fixes back button issue)
  useEffect(() => {
    // Skip the initial mount — handled by the effect above
    const timer = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
        lenisRef.current.resize();
        // Force a scroll event so Framer Motion recalculates IntersectionObserver
        window.dispatchEvent(new Event("scroll"));
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
