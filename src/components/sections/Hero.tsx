"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const t = useTranslations("hero");
  const params = useParams();
  const locale = params.locale as string;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) videoRef.current?.play();
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover scale-105"
      >
        <source src="/images/home_video_pinterest.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center space-y-6 max-w-3xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-accent text-xl md:text-2xl text-accent"
        >
          BraidedByMae
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] tracking-tight whitespace-pre-line"
        >
          {t("headline")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base md:text-lg text-white/70 max-w-lg mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a
            href={`/${locale}/booking`}
            className="group inline-flex items-center gap-2 mt-4 px-10 py-4 rounded-full font-semibold text-white bg-primary cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_rgba(232,93,4,0.35)] hover:-translate-y-0.5"
          >
            {t("cta")}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium">
          {t("scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
