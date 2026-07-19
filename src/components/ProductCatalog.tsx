"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { products, formatIDR, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "Semua" },
  { id: "clippers", label: "Clippers" },
  { id: "trimmers", label: "Trimmers" },
  { id: "accessories", label: "Accessories" },
  { id: "combos", label: "Combo Sets" },
] as const;

export default function ProductCatalog() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [active, setActive] = useState<Product | null>(products[0]);

  const list = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((p) => p.category === filter),
    [filter]
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
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

        <ul className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {list.map((product) => (
            <li key={product.id} id={product.id}>
              <button
                type="button"
                onClick={() => setActive(product)}
                className={cn(
                  "flex w-full items-start justify-between gap-4 py-5 text-left transition-colors",
                  active?.id === product.id ? "text-ink" : "text-steel hover:text-ink"
                )}
              >
                <div>
                  <p className="font-display text-lg font-semibold">{product.name}</p>
                  <p className="mt-1 text-sm">{product.tagline}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-ink">
                  {formatIDR(product.price)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active && (
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            <Image
              src={active.image}
              alt={active.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="mt-6">
            <h2 className="font-display text-3xl font-semibold text-ink">
              {active.name}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-steel">
              {active.description}
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-2">
              {active.specs.map((spec) => (
                <li
                  key={spec}
                  className="border border-[var(--line)] bg-surface px-3 py-2 text-sm text-ink"
                >
                  {spec}
                </li>
              ))}
            </ul>
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `Halo ProClip, saya tertarik ${active.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-signal mt-8"
            >
              Pesan via WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
