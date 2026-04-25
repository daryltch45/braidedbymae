"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  clientName: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
  serviceName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const SERVICE_KEYS = [
  "boxBraids",
  "cornrows",
  "twists",
  "locs",
  "crochet",
  "men",
] as const;

const inputClass =
  "w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

export default function ReviewForm() {
  const t = useTranslations("reviews");
  const tServices = useTranslations("services");
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { rating: 0 } });

  const rating = watch("rating");

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        setServerError(json.error || t("form.errors.generic"));
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError(t("form.errors.network"));
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
        <p className="font-display text-xl font-bold text-foreground">{t("success.title")}</p>
        <p className="text-muted mt-2 text-sm">{t("success.message")}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">{t("form.rating")}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setValue("rating", star, { shouldValidate: true })}
              className="p-0.5 cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  star <= (hovered || rating)
                    ? "fill-accent stroke-accent"
                    : "fill-none stroke-muted"
                )}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-red-500 text-xs mt-1">{t("form.errors.ratingRequired")}</p>}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("form.name")}</label>
        <input
          {...register("clientName")}
          type="text"
          placeholder={t("form.namePlaceholder")}
          className={cn(inputClass, errors.clientName && "border-red-400")}
        />
        {errors.clientName && <p className="text-red-500 text-xs mt-1">{t("form.errors.nameTooShort")}</p>}
      </div>

      {/* Service (optional) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("form.service")}</label>
        <select {...register("serviceName")} className={cn(inputClass, "cursor-pointer")}>
          <option value="">{t("form.serviceOptional")}</option>
          {SERVICE_KEYS.map((key) => (
            <option key={key} value={tServices(`${key}.name`)}>{tServices(`${key}.name`)}</option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">{t("form.comment")}</label>
        <textarea
          {...register("comment")}
          rows={4}
          placeholder={t("form.commentPlaceholder")}
          className={cn(inputClass, "resize-none", errors.comment && "border-red-400")}
        />
        {errors.comment && <p className="text-red-500 text-xs mt-1">{t("form.errors.commentTooShort")}</p>}
      </div>

      {serverError && (
        <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-xl py-2 px-4">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-full bg-primary text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? t("form.submitting") : t("form.submit")}
      </button>
    </form>
  );
}
