"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  images?: string[] | string;
}

export default function PropertyImageSlider({ images }: Props) {

  const safeImages = Array.isArray(images)
    ? images
    : typeof images === "string"
    ? JSON.parse(images || "[]")
    : [];

  const [index, setIndex] = useState(0);

  if (!safeImages || safeImages.length === 0) return null;

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="relative w-full">

      {/* Main Image */}
      <div className="relative h-60 overflow-hidden rounded-t-2xl">
        <motion.img
          key={safeImages[index]}
          src={safeImages[index]}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Left Button */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-900/70 text-white px-3 py-1 rounded hover:bg-slate-800 transition"
        >
          ‹
        </button>

        {/* Right Button */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900/70 text-white px-3 py-1 rounded hover:bg-slate-800 transition"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-2 overflow-x-auto px-2 pb-2">
        {safeImages.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-20 h-20 object-cover rounded border border-slate-700 cursor-pointer hover:opacity-80 transition"
            alt="Property thumbnail"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

    </div>
  );
}
