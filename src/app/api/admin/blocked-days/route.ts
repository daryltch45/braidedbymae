import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { z } from "zod";

const postSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(200).optional(),
});

export async function GET() {
  // Public — used by booking calendar
  try {
    const days = await db.blockedDay.findMany({ orderBy: { date: "asc" } });
    return NextResponse.json(days);
  } catch {
    return NextResponse.json({ error: "Failed to fetch blocked days" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, reason } = postSchema.parse(body);

    const blocked = await db.blockedDay.create({
      data: { date: new Date(date), reason: reason || null },
    });

    return NextResponse.json(blocked, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to block day" }, { status: 500 });
  }
}
