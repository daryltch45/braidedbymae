"use client";

import { useTranslations, useLocale } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { fr as frLocale, enUS, de as deLocale } from "date-fns/locale";
import { Loader2, ArrowRight } from "lucide-react";
import type { BookingFormData, ServiceData } from "@/lib/booking-schema";

interface Step4ConfirmProps {
  form: UseFormReturn<BookingFormData>;
  services: ServiceData[];
  onBack: () => void;
  isSubmitting: boolean;
}

export default function Step4Confirm({
  form,
  services,
  onBack,
  isSubmitting,
}: Step4ConfirmProps) {
  const t = useTranslations("booking.form");
  const locale = useLocale();
  const values = form.getValues();

  const service = services.find((s) => s.id === values.serviceId);
  const dateLocale = locale === "en" ? enUS : locale === "de" ? deLocale : frLocale;

  const getServiceName = (s: ServiceData) => {
    if (locale === "en") return s.nameEn;
    if (locale === "de") return s.nameDe;
    return s.nameFr;
  };

  const formattedDate = values.preferredDate
    ? format(new Date(values.preferredDate), "EEEE d MMMM yyyy", { locale: dateLocale })
    : "—";

  const rows: { label: string; value: string }[] = [
    { label: t("service"), value: service ? getServiceName(service) : "—" },
    { label: t("date"), value: formattedDate },
    { label: t("time"), value: values.preferredTime },
    { label: t("name"), value: values.clientName },
    { label: t("email"), value: values.clientEmail },
    ...(values.clientPhone ? [{ label: t("phone"), value: values.clientPhone }] : []),
    {
      label: t("location"),
      value:
        values.location === "TRAVEL"
          ? `${t("travel")} — ${values.travelCity}`
          : t("home"),
    },
    {
      label: t("payment"),
      value: values.paymentMethod === "CASH" ? t("cash") : t("online"),
    },
    ...(service ? [{ label: t("estimatedPrice"), value: `${service.priceMin}–${service.priceMax}€` }] : []),
  ];

  return (
    <div>
      <div className="bg-surface rounded-2xl border border-foreground/10 overflow-hidden mb-6">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-start px-5 py-3.5 border-b border-foreground/5 last:border-0"
          >
            <span className="w-36 text-sm text-muted shrink-0">{row.label}</span>
            <span className="text-sm font-medium text-foreground capitalize">{row.value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted mb-6">
        {t("consent")}
      </p>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-full border border-foreground/20 text-muted hover:text-foreground hover:border-foreground/40 font-medium cursor-pointer transition-colors disabled:opacity-40"
        >
          &larr; {t("back")}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? t("submitting") : t("submit")}
          {!isSubmitting && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
        </button>
      </div>
    </div>
  );
}
