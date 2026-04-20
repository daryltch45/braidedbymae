"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const serviceKeys = [
  "boxBraids",
  "cornrows",
  "twists",
  "locs",
  "crochet",
  "men",
] as const;

const accentColors = [
  "var(--color-primary)",
  "var(--color-secondary)",
  "var(--color-accent)",
  "var(--color-secondary)",
  "var(--color-primary)",
  "var(--color-accent)",
];

export default function Services() {
  const t = useTranslations("services");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section id="services" className="py-24 px-4 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-accent text-lg text-accent mb-2">
            {t("subtitle")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("title")}
          </h2>
        </motion.div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceKeys.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative h-full rounded-2xl bg-surface border border-foreground/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                {/* Color accent strip */}
                <div
                  className="h-1.5"
                  style={{ backgroundColor: accentColors[index] }}
                />

                <div className="p-6 flex flex-col h-full">
                  {/* Service name */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {t(`${key}.name`)}
                  </h3>

                  {/* Price */}
                  <p
                    className="text-2xl font-bold mb-3"
                    style={{ color: accentColors[index] }}
                  >
                    {t(`${key}.price`)}
                  </p>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 text-sm text-muted mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{t(`${key}.durationRange`)}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed mb-6 flex-1">
                    {t(`${key}.description`)}
                  </p>

                  {/* CTA */}
                  <a
                    href={`/${locale}/booking`}
                    className="inline-flex items-center justify-center w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary transition-all hover:opacity-90 hover:scale-[1.02]"
                  >
                    {t("bookButton")}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
