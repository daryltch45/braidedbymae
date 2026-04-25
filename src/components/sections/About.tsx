"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Calendar, Home } from "lucide-react";
import Image from "next/image";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-28 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div>
              <p className="font-accent text-lg text-accent mb-2">Mae</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                {t("title")}
              </h2>
            </div>

            <p className="text-base md:text-lg text-muted leading-relaxed">
              {t("story")}
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">
                    {t("coverageTitle")}
                  </p>
                  <p className="text-sm text-muted">{t("cities")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                  <Home className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-sm text-muted pt-2.5">{t("homeService")}</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm text-muted pt-2.5">{t("availability")}</p>
              </div>
            </div>
          </motion.div>

          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)]">
              <Image
                src="/images/about/mae_profil_pic.jpeg"
                alt="Mae — BraidedByMae, Nuremberg"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-surface/90 backdrop-blur-sm rounded-2xl px-4 py-3">
                <p className="font-display font-bold text-foreground">Mae</p>
                <p className="font-accent text-sm text-accent">Nuremberg</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
