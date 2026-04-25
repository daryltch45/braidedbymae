"use client";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { ArrowRight, Home, Car, Banknote, CreditCard } from "lucide-react";
import type { BookingFormData } from "@/lib/booking-schema";

interface Step3ContactProps {
  form: UseFormReturn<BookingFormData>;
  onNext: () => void;
  onBack: () => void;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-foreground/15 bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

export default function Step3Contact({ form, onNext, onBack }: Step3ContactProps) {
  const t = useTranslations("booking.form");
  const { register, watch, setValue, formState: { errors } } = form;

  const location = watch("location");
  const paymentMethod = watch("paymentMethod");

  function handleNext() {
    form.trigger(["clientName", "clientEmail", "clientPhone", "location", "travelCity", "paymentMethod"]).then((valid) => {
      if (valid) onNext();
    });
  }

  return (
    <div className="space-y-6">
      {/* Personal info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("name")} error={errors.clientName?.message}>
          <input
            {...register("clientName")}
            type="text"
            placeholder="Aminata Diallo"
            className={cn(inputClass, errors.clientName && "border-red-400")}
          />
        </Field>
        <Field label={t("email")} error={errors.clientEmail?.message}>
          <input
            {...register("clientEmail")}
            type="email"
            placeholder="aminata@email.com"
            className={cn(inputClass, errors.clientEmail && "border-red-400")}
          />
        </Field>
      </div>

      <Field label={t("phone")} error={errors.clientPhone?.message}>
        <input
          {...register("clientPhone")}
          type="tel"
          placeholder="+49 151 12345678"
          className={inputClass}
        />
      </Field>

      {/* Location */}
      <Field label={t("location")} error={errors.location?.message}>
        <div className="flex gap-3">
          {(["HOME", "TRAVEL"] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setValue("location", loc, { shouldValidate: true })}
              className={cn(
                "flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer",
                location === loc
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-foreground/10 text-muted hover:border-primary/30"
              )}
            >
              <span className="inline-flex items-center gap-2">
                {loc === "HOME" ? <Home className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                {loc === "HOME" ? t("home") : t("travel")}
              </span>
            </button>
          ))}
        </div>
      </Field>

      {location === "TRAVEL" && (
        <Field label={t("city")} error={errors.travelCity?.message}>
          <input
            {...register("travelCity")}
            type="text"
            placeholder="Fürth, Erlangen, Bamberg..."
            className={cn(inputClass, errors.travelCity && "border-red-400")}
          />
        </Field>
      )}

      {/* Payment */}
      <Field label={t("payment")} error={errors.paymentMethod?.message}>
        <div className="flex gap-3">
          {(["CASH", "ONLINE"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setValue("paymentMethod", method, { shouldValidate: true })}
              className={cn(
                "flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer",
                paymentMethod === method
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-foreground/10 text-muted hover:border-primary/30"
              )}
            >
              <span className="inline-flex items-center gap-2">
                {method === "CASH" ? <Banknote className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                {method === "CASH" ? t("cash") : t("online")}
              </span>
            </button>
          ))}
        </div>
      </Field>

      {/* Inspiration photo URL */}
      <Field label={t("inspiration")} error={errors.inspirationUrl?.message}>
        <input
          {...register("inspirationUrl")}
          type="url"
          placeholder="https://pinterest.com/..."
          className={inputClass}
        />
      </Field>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-foreground/20 text-muted hover:text-foreground hover:border-foreground/40 font-medium cursor-pointer transition-colors"
        >
          &larr; {t("back")}
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity"
        >
          {t("confirm")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
