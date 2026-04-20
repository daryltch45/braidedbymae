"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const t = useTranslations("hero");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-6"
      >
        <p className="font-accent text-lg md:text-xl text-accent">
          {t("tagline")}
        </p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold text-foreground leading-tight">
          BraidedByMae
        </h1>
        <p className="text-base md:text-lg text-muted whitespace-pre-line max-w-lg mx-auto">
          {t("subtitle")}
        </p>
        <a
          href={`/${locale}/booking`}
          className="inline-block mt-4 px-8 py-4 rounded-full font-semibold text-white bg-primary transition-all hover:scale-105 hover:shadow-lg"
        >
          {t("cta")}
        </a>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-muted" />
      </motion.div>
    </section>
  );
}
