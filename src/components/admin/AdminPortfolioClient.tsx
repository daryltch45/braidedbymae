"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PortfolioImage = { src: string; category: string; filename: string };

const CATEGORIES = ["box-braids", "cornrows", "twists", "locs", "crochet", "men"];

export default function AdminPortfolioClient({
  images: initial,
  categories,
}: {
  images: PortfolioImage[];
  categories: string[];
}) {
  const [images, setImages] = useState(initial);
  const [filterCat, setFilterCat] = useState("all");
  const [uploadCat, setUploadCat] = useState("box-braids");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = filterCat === "all" ? images : images.filter((i) => i.category === filterCat);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("category", uploadCat);

      const res = await fetch("/api/admin/portfolio", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setUploadError(data.error || "Upload failed");
        return;
      }
      const newImage = await res.json();
      setImages((prev) => [...prev, newImage]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(image: PortfolioImage) {
    if (!confirm(`Delete ${image.filename}?`)) return;
    setDeleting(image.src);

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: image.category, filename: image.filename }),
      });
      if (res.ok) {
        setImages((prev) => prev.filter((i) => i.src !== image.src));
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="bg-surface rounded-xl border border-foreground/10 p-5">
        <h3 className="font-semibold text-foreground mb-4">Upload Image</h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">Category</label>
            <select
              value={uploadCat}
              onChange={(e) => setUploadCat(e.target.value)}
              className="rounded-lg border border-foreground/15 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              className="hidden"
              id="portfolio-upload"
            />
            <label
              htmlFor="portfolio-upload"
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all",
                uploading
                  ? "bg-foreground/10 text-muted cursor-not-allowed"
                  : "bg-primary text-white hover:opacity-90"
              )}
            >
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="h-4 w-4" /> Choose file</>
              )}
            </label>
          </div>
        </div>
        {uploadError && (
          <p className="text-red-500 text-sm mt-3">{uploadError}</p>
        )}
      </div>

      {/* Filter + grid */}
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                filterCat === cat
                  ? "bg-primary text-white border-primary"
                  : "border-foreground/15 text-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-surface rounded-xl border border-foreground/10 py-16 text-center text-muted text-sm">
            No images in this category.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((image) => (
            <div key={image.src} className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-foreground/10">
              <Image
                src={image.src}
                alt={image.filename}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">
                  {image.category}
                </span>
                <button
                  onClick={() => handleDelete(image)}
                  disabled={deleting === image.src}
                  className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting === image.src
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Trash2 className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
