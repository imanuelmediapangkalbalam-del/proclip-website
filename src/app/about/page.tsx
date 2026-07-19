import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "ProClip — brand clipper profesional dan studio barbershop yang lahir dari praktik kursi setiap hari.",
};

export default function AboutPage() {
  return (
    <div className="bg-paper pb-24 pt-28 md:pt-32">
      <div className="section-shell">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
          Tentang ProClip
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          Dari kursi ke mesin. Dari mesin kembali ke kursi.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          ProClip lahir dari barber yang frustrasi dengan alat yang drop di jam
          sibuk. Kami merancang clipper untuk beban nyata — lalu membuka studio
          sebagai laboratorium hidup untuk setiap iterasi blade dan grip.
        </p>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="relative min-h-[22rem] overflow-hidden bg-mist md:min-h-[28rem]">
            <Image
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80"
              alt="Barber ProClip sedang bekerja"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center bg-ink p-8 text-white md:p-12">
            <h2 className="font-display text-3xl font-semibold">Misi</h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Memberi barber kontrol penuh atas fade, line, dan stamina — lalu
              memberi klien pengalaman kursi yang terasa intentional, bukan
              terburu-buru.
            </p>
            <Link href="/products" className="btn btn-signal mt-8 w-fit">
              Lihat line-up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
