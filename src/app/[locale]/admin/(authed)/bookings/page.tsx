import { db } from "@/lib/db";
import AdminBookingsClient from "@/components/admin/AdminBookingsClient";

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
      <AdminBookingsClient bookings={bookings} />
    </div>
  );
}
