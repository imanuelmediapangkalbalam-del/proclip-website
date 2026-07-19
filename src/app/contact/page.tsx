import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi ProClip untuk produk, dealer, garansi, atau studio.",
};

export default function ContactPage() {
  return (
    <div className="bg-paper pb-24 pt-28 md:pt-32">
      <div className="section-shell grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-steel">
            Kontak
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            Bicara langsung dengan tim.
          </h1>
          <div className="mt-8 space-y-6 text-sm">
            <div>
              <p className="font-semibold text-ink">Studio</p>
              <p className="mt-1 text-steel">Pangkalbalam · Indonesia</p>
            </div>
            <div>
              <p className="font-semibold text-ink">Jam operasional</p>
              <p className="mt-1 text-steel">Senin–Sabtu · 10:00–21:00</p>
            </div>
            <div>
              <p className="font-semibold text-ink">WhatsApp</p>
              <p className="mt-1 text-steel">+62 812-3456-7890</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
