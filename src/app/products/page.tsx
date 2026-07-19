import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";

export const metadata: Metadata = {
  title: "Produk",
  description:
    "Katalog clipper, trimmer, aksesori, dan combo set ProClip untuk barber profesional.",
};

export default function ProductsPage() {
  return (
    <div className="bg-paper pb-24 pt-28 md:pt-32">
      <div className="section-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
          Katalog
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          Sistem alat. Bukan sekadar mesin.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-steel">
          Pilih unit, lihat spesifikasi, lalu pesan langsung via WhatsApp.
        </p>
        <div className="mt-12">
          <ProductCatalog />
        </div>
      </div>
    </div>
  );
}
