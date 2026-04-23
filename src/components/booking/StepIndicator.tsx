"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEP_KEYS = ["service", "datetime", "contact", "confirm"] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const t = useTranslations("booking.steps");

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_KEYS.map((key, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <div key={key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                  isCompleted
                    ? "bg-primary text-white"
                    : isActive
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-surface border border-foreground/10 text-muted"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  isActive ? "text-foreground" : "text-muted"
                )}
              >
                {t(key)}
              </span>
            </div>
            {index < STEP_KEYS.length - 1 && (
              <div
                className={cn(
                  "h-px w-12 sm:w-20 mx-1 mt-[-18px] transition-colors duration-300",
                  currentStep > stepNumber ? "bg-primary" : "bg-foreground/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
