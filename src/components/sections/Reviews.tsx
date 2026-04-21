"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { StarRating } from "@/components/ui/StarRating";
import ReviewForm from "./ReviewForm";

const reviewKeys = ["review1", "review2", "review3"] as const;

export default function Reviews() {
  const t = useTranslations("reviews");

  return (
    <section id="reviews" className="py-24 px-4 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-accent text-lg text-accent mb-2">{t("subtitle")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("title")}
          </h2>
        </motion.div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviewKeys.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="bg-surface rounded-2xl p-6 border border-foreground/5 space-y-4"
            >
              <StarRating rating={5} />

              <p className="text-sm text-muted leading-relaxed italic">
                &ldquo;{t(`${key}.comment`)}&rdquo;
              </p>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t(`${key}.name`)}
                </p>
                <p className="text-xs text-muted">{t(`${key}.service`)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leave a review */}
        <motion.div
          id="review-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto mt-16 bg-surface rounded-3xl border border-foreground/10 p-8"
        >
          <h3 className="font-display text-2xl font-bold text-foreground mb-1">
            {t("leaveReview")}
          </h3>
          <p className="text-muted text-sm mb-6">Votre avis sera publié après validation.</p>
          <ReviewForm />
        </motion.div>
      </div>
    </section>
  );
}
