import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { z } from "zod";
import { sendBookingPendingEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const bookingSchema = z.object({
  serviceId: z.string().min(1),
  clientName: z.string().min(2).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().max(30).optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  preferredTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time"),
  location: z.enum(["HOME", "TRAVEL"]),
  travelCity: z.string().optional(),
  paymentMethod: z.enum(["CASH", "ONLINE"]),
  inspirationUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(`booking:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const data = bookingSchema.parse(body);

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Check date is not blocked
    const date = new Date(data.preferredDate);
    const blockedDay = await prisma.blockedDay.findFirst({
      where: {
        date: {
          gte: new Date(date.toDateString()),
          lt: new Date(new Date(date.toDateString()).getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });
    if (blockedDay) {
      return NextResponse.json({ error: "This date is not available" }, { status: 409 });
    }

    // Check for duplicate booking at same date/time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (existingBooking) {
      return NextResponse.json({ error: "This time slot is already taken" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId: data.serviceId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || null,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
        location: data.location,
        travelCity: data.travelCity || null,
        paymentMethod: data.paymentMethod,
        inspirationUrl: data.inspirationUrl || null,
      },
      include: { service: true },
    });

    // Send confirmation email (non-blocking)
    sendBookingPendingEmail(booking).catch(console.error);

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
