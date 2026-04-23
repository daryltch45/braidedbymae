import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import path from "path";
import fs from "fs";

const PORTFOLIO_BASE = path.join(process.cwd(), "public", "images", "portfolio");
const ALLOWED_CATEGORIES = ["box-braids", "cornrows", "twists", "locs", "crochet", "men"];

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;

    if (!file || !category || !ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid file or category" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const dir = path.join(PORTFOLIO_BASE, category);
    fs.mkdirSync(dir, { recursive: true });

    const filename = `${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(dir, filename), buffer);

    return NextResponse.json({
      src: `/images/portfolio/${category}/${filename}`,
      category,
      filename,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { category, filename } = await request.json();

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Sanitize filename to prevent path traversal
    const safe = path.basename(filename);
    const filePath = path.join(PORTFOLIO_BASE, category, safe);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
