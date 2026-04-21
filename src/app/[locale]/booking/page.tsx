import { getTranslations } from "next-intl/server";
import { db as prisma } from "@/lib/db";
import BookingForm from "@/components/booking/BookingForm";

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        nameFr: true,
        nameEn: true,
        nameDe: true,
        descFr: true,
        descEn: true,
        descDe: true,
        priceMin: true,
        priceMax: true,
        durationMin: true,
        durationMax: true,
        imageUrl: true,
      },
    });
  } catch {
    return [];
  }
}

async function getBlockedDates() {
  try {
    const blocked = await prisma.blockedDay.findMany({
      where: { date: { gte: new Date() } },
      select: { date: true },
    });
    return blocked.map((d: { date: Date }) => d.date.toISOString().split("T")[0]);
  } catch {
    return [];
  }
}

export default async function BookingPage() {
  const t = await getTranslations("booking");
  const [services, blockedDates] = await Promise.all([getServices(), getBlockedDates()]);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-accent text-lg text-accent mb-2">BraidedByMae</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
            {t("title")}
          </h1>
          <p className="text-muted text-lg">{t("subtitle")}</p>
        </div>

        {/* Form */}
        <div className="bg-surface rounded-3xl border border-foreground/10 shadow-lg p-6 md:p-10">
          <BookingForm services={services} blockedDates={blockedDates} />
        </div>
      </div>
    </main>
  );
}
