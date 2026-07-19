import Image from "next/image";
import Link from "next/link";
import { products, formatIDR } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="noise bg-paper py-24 md:py-32">
      <div className="section-shell relative z-10">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            Produk unggulan
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Alat yang ikut di kursi, bukan di etalase.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={0.1 * i}>
              <Link href={`/products#${product.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-mist">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-steel">{product.tagline}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-ink">
                    {formatIDR(product.price)}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <Link href="/products" className="btn btn-outline">
            Semua produk
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
