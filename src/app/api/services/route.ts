import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
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
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
