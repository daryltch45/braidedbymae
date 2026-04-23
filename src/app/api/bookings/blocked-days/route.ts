import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    const blockedDays = await prisma.blockedDay.findMany({
      where: {
        date: { gte: new Date() },
      },
      select: { date: true, reason: true },
      orderBy: { date: "asc" },
    });

    const dates = blockedDays.map((d: { date: Date }) =>
      d.date.toISOString().split("T")[0]
    );

    return NextResponse.json({ blockedDates: dates });
  } catch {
    return NextResponse.json({ error: "Failed to fetch blocked days" }, { status: 500 });
  }
}
