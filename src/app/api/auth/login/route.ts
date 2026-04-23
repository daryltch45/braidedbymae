import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, signAdminToken, COOKIE_OPTIONS } from "@/lib/auth";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(`login:${ip}`, 5, 300_000)) {
      return NextResponse.json({ error: "Too many attempts. Try again in 5 minutes." }, { status: 429 });
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || email !== adminEmail) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyAdminPassword(password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_OPTIONS.name, token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
