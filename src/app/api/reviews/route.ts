import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const reviewSchema = z.object({
  clientName: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
  serviceName: z.string().max(100).optional(),
});

export async function GET() {
  try {
    const reviews = await db.review.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(`review:${ip}`, 3, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const data = reviewSchema.parse(body);

    const review = await db.review.create({
      data: {
        clientName: data.clientName,
        rating: data.rating,
        comment: data.comment,
        serviceName: data.serviceName || null,
      },
    });

    return NextResponse.json({ success: true, id: review.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
