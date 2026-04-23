"use client";

import { useState } from "react";
import { format, getDay, getDaysInMonth, startOfMonth } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type BlockedDay = { id: string; date: string; reason: string | null };
type BookingDot = { date: string; status: string; clientName: string; serviceName: string };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AdminCalendarClient({
  blockedDays: initialBlocked,
  bookings,
}: {
  blockedDays: BlockedDay[];
  bookings: BookingDot[];
}) {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [blocked, setBlocked] = useState(initialBlocked);
  const [loading, setLoading] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDayOfWeek = (getDay(startOfMonth(new Date(year, month))) + 6) % 7; // Mon=0
  const blanks = Array.from({ length: firstDayOfWeek });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function dateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isBlocked(day: number) {
    return blocked.find((b) => b.date === dateKey(day));
  }

  function getBookings(day: number) {
    return bookings.filter((b) => b.date === dateKey(day));
  }

  async function toggleBlock(day: number) {
    const key = dateKey(day);
    const existing = isBlocked(day);
    setLoading(key);

    try {
      if (existing) {
        const res = await fetch(`/api/admin/blocked-days/${existing.id}`, { method: "DELETE" });
        if (res.ok) {
          setBlocked((prev) => prev.filter((b) => b.id !== existing.id));
        }
      } else {
        const res = await fetch("/api/admin/blocked-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: key }),
        });
        if (res.ok) {
          const data = await res.json();
          setBlocked((prev) => [...prev, { id: data.id, date: key, reason: null }]);
        }
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-400" />Blocked</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-green-400" />Confirmed</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-yellow-400" />Pending</span>
      </div>

      <div className="bg-surface rounded-xl border border-foreground/10 overflow-hidden">
        {/* Month nav */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="font-semibold text-foreground">
            {format(new Date(year, month), "MMMM yyyy")}
          </h2>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-foreground/10">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-muted py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {blanks.map((_, i) => <div key={`blank-${i}`} className="border-b border-r border-foreground/5 min-h-[72px]" />)}
          {days.map((day) => {
            const key = dateKey(day);
            const blockedEntry = isBlocked(day);
            const dayBookings = getBookings(day);
            const isToday = key === today;
            const isPast = key < today;
            const isLoading = loading === key;

            return (
              <div
                key={day}
                className={cn(
                  "border-b border-r border-foreground/5 min-h-[72px] p-2 relative",
                  !isPast && "cursor-pointer hover:bg-foreground/3 transition-colors",
                  blockedEntry && "bg-red-50 dark:bg-red-900/10",
                  isPast && "opacity-40"
                )}
                onClick={() => !isPast && toggleBlock(day)}
              >
                <span className={cn(
                  "text-xs font-medium inline-flex h-6 w-6 items-center justify-center rounded-full",
                  isToday ? "bg-primary text-white" : "text-foreground"
                )}>
                  {day}
                </span>

                {isLoading && (
                  <Loader2 className="h-3 w-3 absolute top-2 right-2 text-primary animate-spin" />
                )}

                {blockedEntry && !isLoading && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-400" />
                )}

                <div className="mt-1 space-y-0.5">
                  {dayBookings.map((b, i) => (
                    <div
                      key={i}
                      className={cn(
                        "text-xs px-1.5 py-0.5 rounded truncate",
                        b.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}
                    >
                      {b.clientName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted">Click any future date to block or unblock it.</p>
    </div>
  );
}
