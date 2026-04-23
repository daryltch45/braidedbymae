"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";
import { bookingSchema, type BookingFormData, type ServiceData } from "@/lib/booking-schema";
import StepIndicator from "./StepIndicator";
import Step1Service from "./Step1Service";
import Step2DateTime from "./Step2DateTime";
import Step3Contact from "./Step3Contact";
import Step4Confirm from "./Step4Confirm";

interface BookingFormProps {
  services: ServiceData[];
  blockedDates: string[];
}

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function BookingForm({ services, blockedDates }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("booking");

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      preferredDate: "",
      preferredTime: "",
      location: "HOME",
      travelCity: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      paymentMethod: "CASH",
      inspirationUrl: "",
    },
    mode: "onChange",
  });

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => s - 1);
  }

  async function onSubmit(data: BookingFormData) {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Une erreur est survenue. Veuillez réessayer.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          {t("success.title")}
        </h2>
        <p className="text-muted text-lg max-w-md mx-auto">
          {t("success.message")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <StepIndicator currentStep={step} />

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {step === 1 && (
              <Step1Service form={form} services={services} onNext={goNext} />
            )}
            {step === 2 && (
              <Step2DateTime
                form={form}
                blockedDates={blockedDates}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <Step3Contact form={form} onNext={goNext} onBack={goBack} />
            )}
            {step === 4 && (
              <Step4Confirm
                form={form}
                services={services}
                onBack={goBack}
                isSubmitting={isSubmitting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-4 text-center text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded-xl py-3 px-4">
          {error}
        </p>
      )}
    </form>
  );
}
