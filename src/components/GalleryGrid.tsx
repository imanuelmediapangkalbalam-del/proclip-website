"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { gallery } from "@/lib/data";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "Semua" },
  { id: "fade", label: "Fade" },
  { id: "beard", label: "Beard" },
  { id: "classic", label: "Classic" },
  { id: "studio", label: "Studio" },
] as const;

export default function GalleryGrid() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [lightbox, setLightbox] = useState<(typeof gallery)[number] | null>(null);

  const items = useMemo(
    () =>
      filter === "all" ? gallery : gallery.filter((g) => g.category === filter),
    [filter]
  );

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "min-h-10 px-4 text-sm font-medium transition-colors",
              filter === f.id
                ? "bg-ink text-white"
                : "border border-[var(--line)] bg-surface text-steel hover:text-ink"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(item)}
            className="group relative aspect-[4/5] overflow-hidden bg-mist text-left"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent p-4">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="text-xs uppercase tracking-wider text-white/60">
                {item.category}
              </p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 text-white"
              onClick={() => setLightbox(null)}
              aria-label="Tutup"
            >
              <X className="h-7 w-7" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative h-[70vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.image}
                alt={lightbox.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
