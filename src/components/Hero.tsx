import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 animate-pan">
        <Image
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2000&q=80"
          alt="Interior studio barbershop ProClip"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />
      </div>

      <div className="relative z-10 section-shell flex min-h-[100svh] flex-col justify-end pb-16 pt-28 md:pb-20 md:pt-32">
        <p className="brand-mark animate-rise text-5xl leading-none sm:text-7xl md:text-8xl lg:text-9xl">
          ProClip
        </p>
        <div className="mt-4 h-[3px] w-24 bg-signal animate-draw" />
        <h1 className="animate-rise mt-8 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          Potongan yang tahan.
        </h1>
        <p className="animate-rise mt-4 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
          Clipper studio-grade dan kursi barber yang presisi — untuk barber dan
          klien yang tidak kompromi.
        </p>
        <div className="animate-rise mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="btn btn-signal">
            Lihat produk
          </Link>
          <Link href="/booking" className="btn btn-ghost">
            Book kursi
          </Link>
        </div>
      </div>
    </section>
  );
}
