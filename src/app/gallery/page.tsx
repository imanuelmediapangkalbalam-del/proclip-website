import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Dokumentasi fade, beard, classic cut, dan suasana studio ProClip.",
};

export default function GalleryPage() {
  return (
    <div className="bg-paper pb-24 pt-28 md:pt-32">
      <div className="section-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
          Gallery
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          Kerja blade, hasil kursi.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-steel">
          Filter kategori, klik foto untuk melihat lebih dekat.
        </p>
        <div className="mt-12">
          <GalleryGrid />
        </div>
      </div>
    </div>
  );
}
