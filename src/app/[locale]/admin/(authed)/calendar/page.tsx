import { db } from "@/lib/db";
import AdminCalendarClient from "@/components/admin/AdminCalendarClient";

export default async function AdminCalendarPage() {
  const [blockedDays, bookings] = await Promise.all([
    db.blockedDay.findMany({ orderBy: { date: "asc" } }),
    db.booking.findMany({
      where: { status: { in: ["CONFIRMED", "PENDING"] } },
      select: { preferredDate: true, status: true, clientName: true, service: { select: { nameFr: true } } },
    }),
  ]);

  const blocked = blockedDays.map((d) => ({
    id: d.id,
    date: d.date.toISOString().split("T")[0],
    reason: d.reason,
  }));

  const booked = bookings.map((b) => ({
    date: new Date(b.preferredDate).toISOString().split("T")[0],
    status: b.status,
    clientName: b.clientName,
    serviceName: b.service.nameFr,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
      <AdminCalendarClient blockedDays={blocked} bookings={booked} />
    </div>
  );
}
