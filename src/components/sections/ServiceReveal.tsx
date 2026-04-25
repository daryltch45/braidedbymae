"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";

interface ServiceRevealProps {
  serviceKey: string;
  imageSrc: string;
  reverse?: boolean;
  accentColor: string;
}

export default function ServiceReveal({
  serviceKey,
  imageSrc,
  reverse = false,
  accentColor,
}: ServiceRevealProps) {
  const t = useTranslations("services");
  const params = useParams();
  const locale = params.locale as string;
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.7],
    reverse
      ? ["inset(0 0 0 100%)", "inset(0 0 0 0%)"]
      : ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]
  );
  const translateY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center py-16 md:py-0 px-4 bg-background"
    >
      <div className="mx-auto max-w-7xl w-full">
        <div
          className={`flex flex-col gap-8 md:gap-16 items-center ${
            reverse ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          {/* Image side */}
          <motion.div
            style={{ clipPath }}
            className="w-full md:w-1/2 relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)]"
          >
            <Image
              src={imageSrc}
              alt={t(`${serviceKey}.name`)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>

          {/* Text side */}
          <motion.div
            style={{ opacity, y: translateY }}
            className="w-full md:w-1/2 space-y-6"
          >
            {/* Accent line */}
            <div
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: accentColor }}
            />

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {t(`${serviceKey}.name`)}
            </h2>

            <p className="text-base md:text-lg text-muted leading-relaxed max-w-md">
              {t(`${serviceKey}.description`)}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              {/* Price */}
              <span
                className="text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: accentColor }}
              >
                {t(`${serviceKey}.price`)}
              </span>

              {/* Duration */}
              <span className="flex items-center gap-1.5 text-sm text-muted">
                <Clock className="h-4 w-4" />
                {t(`${serviceKey}.durationRange`)}
              </span>
            </div>

            <a
              href={`/${locale}/booking`}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white bg-primary cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-0.5"
            >
              {t("bookButton")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
