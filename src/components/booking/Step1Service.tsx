"use client";

import { useTranslations, useLocale } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Clock, DollarSign } from "lucide-react";
import type { BookingFormData, ServiceData } from "@/lib/booking-schema";

interface Step1ServiceProps {
  form: UseFormReturn<BookingFormData>;
  services: ServiceData[];
  onNext: () => void;
}

export default function Step1Service({ form, services, onNext }: Step1ServiceProps) {
  const t = useTranslations("booking");
  const locale = useLocale();

  const getServiceName = (service: ServiceData) => {
    if (locale === "en") return service.nameEn;
    if (locale === "de") return service.nameDe;
    return service.nameFr;
  };

  const getServiceDesc = (service: ServiceData) => {
    if (locale === "en") return service.descEn;
    if (locale === "de") return service.descDe;
    return service.descFr;
  };

  const selectedId = form.watch("serviceId");
  const error = form.formState.errors.serviceId;

  function handleSelect(id: string) {
    form.setValue("serviceId", id, { shouldValidate: true });
  }

  function handleNext() {
    form.trigger("serviceId").then((valid) => {
      if (valid) onNext();
    });
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {services.map((service) => {
          const isSelected = selectedId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => handleSelect(service.id)}
              className={cn(
                "relative text-left rounded-2xl border-2 p-5 transition-all duration-200",
                "hover:border-primary/50 hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-foreground/10 bg-surface"
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <h3 className="font-display font-bold text-lg text-foreground mb-1.5">
                {getServiceName(service)}
              </h3>
              <p className="text-sm text-muted mb-4 leading-relaxed">
                {getServiceDesc(service)}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  {service.priceMin}–{service.priceMax}€
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {Math.round(service.durationMin / 60)}–{Math.round(service.durationMax / 60)}h
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-sm mb-4">{error.message}</p>
      )}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
        >
          {t("steps.datetime")} →
        </button>
      </div>
    </div>
  );
}
