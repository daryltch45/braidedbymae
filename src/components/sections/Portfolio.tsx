"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "all",
  "box-braids",
  "cornrows",
  "twists",
  "locs",
  "crochet",
  "men",
] as const;

const portfolioImages = [
  { src: "/images/portfolio/box-braids/IMG_4089.JPG", category: "box-braids", alt: "Box Braids style 1" },
  { src: "/images/portfolio/box-braids/IMG_4090.JPG", category: "box-braids", alt: "Box Braids style 2" },
  { src: "/images/portfolio/twists/IMG_4093.JPG", category: "twists", alt: "Twists style 1" },
  { src: "/images/portfolio/twists/IMG_4094.JPG", category: "twists", alt: "Twists style 2" },
  { src: "/images/portfolio/crochet/IMG_4091.JPG", category: "crochet", alt: "Crochet style 1" },
  { src: "/images/portfolio/crochet/IMG_4092.JPG", category: "crochet", alt: "Crochet style 2" },
];

export default function Portfolio() {
  const t = useTranslations("portfolio");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages =
    activeCategory === "all"
      ? portfolioImages
      : portfolioImages.filter((img) => img.category === activeCategory);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxImage) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [lightboxImage]);

  return (
    <section id="portfolio" className="py-24 px-4 bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-accent text-lg text-accent mb-2">{t("subtitle")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            {t("title")}
          </h2>
        </motion.div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface text-muted border border-foreground/10 hover:text-foreground hover:border-foreground/20"
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
            {filteredImages.map((image) => (
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
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm"
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
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
