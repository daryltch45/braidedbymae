"use client";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";
import { format, addDays, isBefore, startOfDay, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingFormData } from "@/lib/booking-schema";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
];

interface Step2DateTimeProps {
  form: UseFormReturn<BookingFormData>;
  blockedDates: string[];
  onNext: () => void;
  onBack: () => void;
}

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (getDay(firstDay) + 6) % 7; // Monday-first
  const days: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));

  return days;
}

export default function Step2DateTime({
  form,
  blockedDates,
  onNext,
  onBack,
}: Step2DateTimeProps) {
  const t = useTranslations("booking.form");
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const selectedDate = form.watch("preferredDate");
  const selectedTime = form.watch("preferredTime");
  const dateError = form.formState.errors.preferredDate;
  const timeError = form.formState.errors.preferredTime;

  const days = generateCalendarDays(viewDate.year, viewDate.month);
  const monthLabel = format(new Date(viewDate.year, viewDate.month, 1), "MMMM yyyy", { locale: fr });

  function isBlocked(date: Date) {
    const key = format(date, "yyyy-MM-dd");
    return blockedDates.includes(key);
  }

  function isDisabled(date: Date) {
    return isBefore(date, today) || isBlocked(date);
  }

  function selectDate(date: Date) {
    if (isDisabled(date)) return;
    form.setValue("preferredDate", format(date, "yyyy-MM-dd"), { shouldValidate: true });
    form.setValue("preferredTime", ""); // reset time when date changes
  }

  function prevMonth() {
    setViewDate((v) => {
      const d = new Date(v.year, v.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function nextMonth() {
    setViewDate((v) => {
      const d = new Date(v.year, v.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function handleNext() {
    form.trigger(["preferredDate", "preferredTime"]).then((valid) => {
      if (valid) onNext();
    });
  }

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        {/* Calendar */}
        <div className="bg-surface rounded-2xl border border-foreground/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-semibold text-foreground capitalize text-sm">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-foreground/5 text-muted hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d) => (
              <div key={d} className="text-center text-xs text-muted font-medium py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} />;
              const key = format(date, "yyyy-MM-dd");
              const disabled = isDisabled(date);
              const selected = selectedDate === key;
              const blocked = isBlocked(date);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDate(date)}
                  className={cn(
                    "aspect-square rounded-full text-xs font-medium transition-all",
                    selected
                      ? "bg-primary text-white"
                      : blocked
                      ? "bg-red-100 text-red-400 dark:bg-red-900/20 cursor-not-allowed line-through"
                      : disabled
                      ? "text-foreground/20 cursor-not-allowed"
                      : "hover:bg-primary/10 hover:text-primary text-foreground"
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {dateError && (
            <p className="text-red-500 text-xs mt-2">{dateError.message}</p>
          )}
        </div>

        {/* Time slots */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">{t("time")}</p>
          {!selectedDate ? (
            <p className="text-muted text-sm">Sélectionnez d&apos;abord une date</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() =>
                    form.setValue("preferredTime", slot, { shouldValidate: true })
                  }
                  className={cn(
                    "py-2.5 rounded-xl text-sm font-medium border transition-all",
                    selectedTime === slot
                      ? "bg-primary text-white border-primary"
                      : "bg-surface border-foreground/10 text-foreground hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
          {timeError && (
            <p className="text-red-500 text-xs mt-2">{timeError.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-full border border-foreground/20 text-muted hover:text-foreground hover:border-foreground/40 font-medium transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Coordonnées →
        </button>
      </div>
    </div>
  );
}
