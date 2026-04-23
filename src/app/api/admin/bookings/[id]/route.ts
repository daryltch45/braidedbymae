import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { sendBookingStatusEmail } from "@/lib/email";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED", "PENDING"]),
  adminNotes: z.string().max(500).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = patchSchema.parse(body);

    const booking = await db.booking.update({
      where: { id },
      data: { status: data.status, adminNotes: data.adminNotes },
      include: { service: true },
    });

    // Send email for confirmed/rejected transitions
    if (data.status === "CONFIRMED" || data.status === "REJECTED") {
      sendBookingStatusEmail(booking, data.status).catch(console.error);
    }

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
