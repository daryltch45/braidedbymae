"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Calendar, Home } from "lucide-react";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 px-4 bg-surface">
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
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                {t("title")}
              </h2>
            </div>

            <p className="text-base md:text-lg text-muted leading-relaxed">
              {t("story")}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">
                    {t("coverageTitle")}
                  </p>
                  <p className="text-sm text-muted">{t("cities")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 mt-0.5 shrink-0 text-secondary" />
                <p className="text-sm text-muted">{t("homeService")}</p>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 shrink-0 text-accent" />
                <p className="text-sm text-muted">{t("availability")}</p>
              </div>
            </div>
          </motion.div>

          {/* Visual side — decorative brand card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden bg-background">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-display font-bold"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  M
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    BraidedByMae
                  </p>
                  <p className="font-accent text-base text-accent mt-1">
                    Nuremberg
                  </p>
                </div>
                <div className="flex gap-2">
                  {["#E85D04", "#9B2226", "#FFB703"].map((color) => (
                    <div
                      key={color}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              {/* Decorative gradient rings */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20"
                style={{ backgroundColor: "var(--color-primary)" }}
              />
              <div
                className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
