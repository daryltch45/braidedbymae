import AdminPortfolioClient from "@/components/admin/AdminPortfolioClient";
import path from "path";
import fs from "fs";

const PORTFOLIO_BASE = path.join(process.cwd(), "public", "images", "portfolio");

function scanLocalImages() {
  const categories = ["box-braids", "cornrows", "twists", "locs", "crochet", "men"];
  const images: { src: string; category: string; filename: string }[] = [];

  for (const cat of categories) {
    const dir = path.join(PORTFOLIO_BASE, cat);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    for (const file of files) {
      images.push({
        src: `/images/portfolio/${cat}/${file}`,
        category: cat,
        filename: file,
      });
    }
  }
  return images;
}

export default async function AdminPortfolioPage() {
  const localImages = scanLocalImages();
  const categories = ["box-braids", "cornrows", "twists", "locs", "crochet", "men"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
      <AdminPortfolioClient images={localImages} categories={categories} />
    </div>
  );
}
