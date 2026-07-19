import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book Studio",
  description:
    "Booking kursi ProClip Studio — pilih layanan, tanggal, dan jam, konfirmasi via WhatsApp.",
};

export default function BookingPage() {
  return (
    <div className="bg-paper pb-24 pt-28 md:pt-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            Studio booking
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Ambil slot. Datang tepat.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-steel">
            Jam operasional Senin–Sabtu, 10:00–21:00. Booking dikonfirmasi
            setelah pesan WhatsApp terkirim.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink">
            <li className="border-l-2 border-signal pl-4">
              Datang 5 menit lebih awal
            </li>
            <li className="border-l-2 border-signal pl-4">
              Bawa referensi foto jika ada
            </li>
            <li className="border-l-2 border-signal pl-4">
              Reschedule minimal H-1 via WA
            </li>
          </ul>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
