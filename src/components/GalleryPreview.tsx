import Image from "next/image";
import Link from "next/link";
import { gallery } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function GalleryPreview() {
  const items = gallery.slice(0, 4);

  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="section-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
              Gallery
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
              Hasil di kursi. Bukti di blade.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/gallery" className="btn btn-outline w-fit">
              Lihat gallery
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={0.06 * i} className={i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}>
              <div className={`relative overflow-hidden bg-mist ${i === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[28rem]" : "aspect-[4/5]"}`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
