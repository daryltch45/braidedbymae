"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGES_PER_PAGE = 9;

const portfolioImages = [
  { src: "/images/portfolio/box-braids/IMG_4089.JPG", category: "box-braids", alt: "Box Braids style 1" },
  { src: "/images/portfolio/box-braids/IMG_4090.JPG", category: "box-braids", alt: "Box Braids style 2" },
  { src: "/images/portfolio/twists/IMG_4093.JPG", category: "twists", alt: "Twists style 1" },
  { src: "/images/portfolio/twists/IMG_4094.JPG", category: "twists", alt: "Twists style 2" },
  { src: "/images/portfolio/crochet/IMG_4091.JPG", category: "crochet", alt: "Crochet style 1" },
  { src: "/images/portfolio/crochet/IMG_4092.JPG", category: "crochet", alt: "Crochet style 2" },
];

const categories = [
  "all",
  ...Array.from(new Set(portfolioImages.map((img) => img.category))),
];

export default function Portfolio() {
  const t = useTranslations("portfolio");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredImages =
    activeCategory === "all"
      ? portfolioImages
      : portfolioImages.filter((img) => img.category === activeCategory);

  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * IMAGES_PER_PAGE;
    return filteredImages.slice(start, start + IMAGES_PER_PAGE);
  }, [filteredImages, currentPage]);

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    setCurrentPage(page);
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!lightboxImage) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [lightboxImage]);

  return (
    <section id="portfolio" className="py-28 px-4 bg-surface">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-accent text-lg text-accent mb-2">{t("subtitle")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            {t("title")}
          </h2>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-250",
                activeCategory === cat
                  ? "bg-primary text-white shadow-[var(--shadow-glow-primary)]"
                  : "bg-surface text-muted border border-foreground/10 hover:text-foreground hover:border-foreground/20 hover:shadow-[var(--shadow-soft)]"
              )}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <motion.div
          layout
          className="columns-2 md:columns-3 gap-4 space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {paginatedImages.map((image) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="break-inside-avoid cursor-pointer group"
                onClick={() => setLightboxImage(image.src)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-[var(--shadow-card)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-elevated)]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2.5 rounded-full border border-foreground/10 text-muted hover:text-foreground hover:border-foreground/20 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label={t("prevPage")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  "h-10 w-10 rounded-full text-sm font-medium cursor-pointer transition-all duration-200",
                  currentPage === page
                    ? "bg-primary text-white shadow-[var(--shadow-glow-primary)]"
                    : "text-muted hover:text-foreground hover:bg-foreground/5"
                )}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-full border border-foreground/10 text-muted hover:text-foreground hover:border-foreground/20 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label={t("nextPage")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors duration-200 flex items-center gap-2 text-sm cursor-pointer"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" />
                {t("close")}
              </button>
              <Image
                src={lightboxImage}
                alt=""
                width={1200}
                height={1600}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
