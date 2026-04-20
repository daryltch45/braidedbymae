"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.55a8.16 8.16 0 0 0 4.77 1.52V6.69h-1.01z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function ContactCTA() {
  const t = useTranslations("contact");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <section
      id="contact"
      className="py-32 px-4"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            {t("ctaHeadline")}
          </h2>

          <p className="text-white/80 text-lg max-w-md mx-auto">
            {t("ctaSubtext")}
          </p>

          <a
            href={`/${locale}/booking`}
            className="inline-block px-10 py-5 rounded-full font-semibold bg-white text-primary text-lg transition-all hover:scale-105 hover:shadow-2xl"
          >
            {t("ctaButton")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
