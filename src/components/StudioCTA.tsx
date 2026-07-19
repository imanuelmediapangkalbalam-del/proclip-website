import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function StudioCTA() {
  return (
    <section className="relative overflow-hidden bg-mist py-24 md:py-32">
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-signal/10 blur-3xl"
        aria-hidden
      />
      <div className="section-shell relative">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            Studio ProClip
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Booking kursi. Datang siap digarap.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-steel">
            Fade, beard, atau full ritual — slot terbatas setiap hari. Pilih
            layanan, jam, dan kami konfirmasi lewat WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/booking" className="btn btn-signal">
              Buka booking
            </Link>
            <Link href="/about" className="btn btn-outline">
              Cerita studio
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
