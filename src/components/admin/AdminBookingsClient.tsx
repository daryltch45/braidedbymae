"use client";

import { useState } from "react";
import { format } from "date-fns";
import { X, Phone, Mail, MapPin, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  preferredDate: Date | string;
  preferredTime: string;
  location: string;
  travelCity: string | null;
  paymentMethod: string;
  status: string;
  adminNotes: string | null;
  inspirationUrl: string | null;
  createdAt: Date | string;
  service: { nameFr: string; nameEn: string; priceMin: number; priceMax: number };
};

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"];

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  CANCELLED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function AdminBookingsClient({ bookings: initial }: { bookings: Booking[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  async function updateStatus(id: string, status: string) {
    setLoading(id + status);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
        if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : prev);
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
              filter === s
                ? "bg-primary text-white border-primary"
                : "border-foreground/15 text-muted hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-foreground/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-foreground/10 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Client</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Service</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No bookings.</td></tr>
              )}
              {filtered.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-foreground/3 transition-colors cursor-pointer"
                  onClick={() => setSelected(booking)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{booking.clientName}</p>
                    <p className="text-xs text-muted">{booking.clientEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{booking.service.nameFr}</td>
                  <td className="px-4 py-3 text-muted">
                    {format(new Date(booking.preferredDate), "dd MMM yyyy")} {booking.preferredTime}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", STATUS_STYLES[booking.status])}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {format(new Date(booking.createdAt), "dd MMM")}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {booking.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(booking.id, "CONFIRMED")}
                          disabled={loading === booking.id + "CONFIRMED"}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "REJECTED")}
                          disabled={loading === booking.id + "REJECTED"}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-surface w-full max-w-md h-full shadow-2xl overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10 sticky top-0 bg-surface z-10">
              <h2 className="font-semibold text-foreground">Booking Details</h2>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-full hover:bg-foreground/5 text-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 flex-1 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full", STATUS_STYLES[selected.status])}>
                  {selected.status}
                </span>
                <span className="text-xs text-muted">#{selected.id.slice(-6)}</span>
              </div>

              {/* Client info */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Client</h3>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{selected.clientName}</p>
                  <a href={`mailto:${selected.clientEmail}`} className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5" />{selected.clientEmail}
                  </a>
                  {selected.clientPhone && (
                    <a href={`tel:${selected.clientPhone}`} className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
                      <Phone className="h-3.5 w-3.5" />{selected.clientPhone}
                    </a>
                  )}
                </div>
              </section>

              {/* Appointment */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">Appointment</h3>
                <div className="bg-background rounded-xl p-4 space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Service</span>
                    <span className="font-medium">{selected.service.nameFr}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Date & Time</span>
                    <span className="font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(selected.preferredDate), "dd MMM yyyy")} at {selected.preferredTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Location</span>
                    <span className="font-medium flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {selected.location === "TRAVEL" ? `Travel — ${selected.travelCity}` : "Mae's home"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Payment</span>
                    <span className="font-medium flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" />
                      {selected.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Price range</span>
                    <span className="font-medium">{selected.service.priceMin}–{selected.service.priceMax}€</span>
                  </div>
                </div>
              </section>

              {selected.inspirationUrl && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Inspiration</h3>
                  <a href={selected.inspirationUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">
                    {selected.inspirationUrl}
                  </a>
                </section>
              )}

              {selected.adminNotes && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">Notes</h3>
                  <p className="text-sm text-foreground">{selected.adminNotes}</p>
                </section>
              )}
            </div>

            {/* Actions */}
            {selected.status === "PENDING" && (
              <div className="px-6 py-4 border-t border-foreground/10 flex gap-3 sticky bottom-0 bg-surface">
                <button
                  onClick={() => updateStatus(selected.id, "CONFIRMED")}
                  disabled={!!loading}
                  className="flex-1 py-2.5 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  ✓ Confirm
                </button>
                <button
                  onClick={() => updateStatus(selected.id, "REJECTED")}
                  disabled={!!loading}
                  className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
