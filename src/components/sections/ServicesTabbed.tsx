"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const serviceKeys = ["boxBraids", "cornrows", "twists", "locs", "crochet", "men"] as const;

const serviceImages: Record<string, string> = {
  boxBraids: "/images/portfolio/box-braids/IMG_4089.JPG",
  cornrows:  "/images/portfolio/twists/IMG_4094.JPG",
  twists:    "/images/portfolio/twists/IMG_4093.JPG",
  locs:      "/images/portfolio/box-braids/IMG_4090.JPG",
  crochet:   "/images/portfolio/crochet/IMG_4091.JPG",
  men:       "/images/portfolio/crochet/IMG_4092.JPG",
};

const accentColors: Record<string, string> = {
  boxBraids: "var(--color-primary)",
  cornrows:  "var(--color-secondary)",
  twists:    "var(--color-accent)",
  locs:      "var(--color-secondary)",
  crochet:   "var(--color-primary)",
  men:       "var(--color-accent)",
};

export default function ServicesTabbed() {
  const t = useTranslations("services");
  const params = useParams();
  const locale = params.locale as string;
  const [active, setActive] = useState<string>("boxBraids");

  return (
    <section id="services" className="py-24 px-4 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="font-accent text-lg text-accent mb-2">{t("subtitle")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {t("title")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12 items-start">
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {serviceKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 whitespace-nowrap md:whitespace-normal cursor-pointer",
                  active === key
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted hover:text-foreground hover:bg-surface"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-all"
                  style={{
                    backgroundColor: active === key ? accentColors[key] : "transparent",
                    border: `2px solid ${accentColors[key]}`,
                  }}
                />
                {t(`${key}.name`)}
              </button>
            ))}
          </nav>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)]">
                <Image
                  src={serviceImages[active]}
                  alt={t(`${active}.name`)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              <div className="space-y-5">
                <div
                  className="w-12 h-1 rounded-full"
                  style={{ backgroundColor: accentColors[active] }}
                />
                <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {t(`${active}.name`)}
                </h3>
                <p className="text-muted leading-relaxed">
                  {t(`${active}.description`)}
                </p>
                <div className="flex items-center gap-6">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: accentColors[active] }}
                  >
                    {t(`${active}.price`)}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <Clock className="h-4 w-4" />
                    {t(`${active}.durationRange`)}
                  </span>
                </div>
                <a
                  href={`/${locale}/booking`}
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-primary cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5"
                >
                  {t("bookButton")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
