"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface ParallaxImage {
  src: string;
  alt: string;
  width: string;
  height: string;
  top?: string;
  left?: string;
}

interface ZoomParallaxProps {
  images: ParallaxImage[];
  children?: React.ReactNode;
}

export function ZoomParallax({ images, children }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Image layers */}
        {images.map((image, index) => {
          const scale = scales[index % scales.length];
          return (
            <motion.div
              key={index}
              style={{ scale }}
              className="absolute top-0 flex h-full w-full items-center justify-center"
            >
              <div
                className="relative overflow-hidden rounded-xl"
                style={{
                  width: image.width,
                  height: image.height,
                  top: image.top || "0",
                  left: image.left || "0",
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes={index === 0 ? "(max-width: 768px) 70vw, 30vw" : "(max-width: 768px) 30vw, 25vw"}
                />
              </div>
            </motion.div>
          );
        })}

        {/* Content overlay — sits on top of all images */}
        {children && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}
