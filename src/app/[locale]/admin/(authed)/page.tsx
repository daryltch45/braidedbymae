import { db } from "@/lib/db";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { BookOpen, Clock, Star, CheckCircle } from "lucide-react";

async function getStats() {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [pendingBookings, weekBookings, pendingReviews, recentBookings] = await Promise.all([
    db.booking.count({ where: { status: "PENDING" } }),
    db.booking.count({
      where: {
        status: { in: ["CONFIRMED", "PENDING"] },
        preferredDate: { gte: weekStart, lte: weekEnd },
      },
    }),
    db.review.count({ where: { status: "PENDING" } }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { service: true },
    }),
  ]);

  return { pendingBookings, weekBookings, pendingReviews, recentBookings };
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  CANCELLED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { pendingBookings, weekBookings, pendingReviews, recentBookings } = await getStats();

  const stats = [
    { label: "Pending bookings", value: pendingBookings, icon: Clock, color: "text-yellow-500" },
    { label: "Bookings this week", value: weekBookings, icon: CheckCircle, color: "text-green-500" },
    { label: "Reviews to moderate", value: pendingReviews, icon: Star, color: "text-accent" },
    { label: "Total bookings", value: pendingBookings + weekBookings, icon: BookOpen, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Welcome back, Mae 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-foreground/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted font-medium uppercase tracking-wide">{stat.label}</p>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-surface rounded-xl border border-foreground/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-foreground/10 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Recent Bookings</h2>
          <a href={`/${locale}/admin/bookings`} className="text-xs text-primary hover:underline">
            View all →
          </a>
        </div>
        <div className="divide-y divide-foreground/5">
          {recentBookings.length === 0 && (
            <p className="px-5 py-8 text-center text-muted text-sm">No bookings yet.</p>
          )}
          {recentBookings.map((booking) => (
            <div key={booking.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{booking.clientName}</p>
                <p className="text-xs text-muted">{booking.service.nameFr} · {format(booking.preferredDate, "dd MMM yyyy")} {booking.preferredTime}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[booking.status]}`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
