# ProClip Website

Website profesional untuk brand **ProClip** — clipper studio-grade dan barbershop studio.

## Fitur

- Landing page dengan hero full-bleed, produk unggulan, teknologi, gallery, dan CTA studio
- Katalog produk interaktif (filter + detail panel)
- Gallery dengan filter kategori + lightbox
- Sistem booking kursi (layanan, tanggal, jam) → konfirmasi WhatsApp
- Halaman tentang & kontak
- Animasi Framer Motion, scroll progress, floating WhatsApp
- SEO metadata + JSON-LD LocalBusiness/BarberShop

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Framer Motion
- TypeScript

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Build produksi

```bash
npm run build
npm start
```

## Catatan

Ganti nomor WhatsApp placeholder (`6281234567890`) di:

- `src/components/WhatsAppFloat.tsx`
- `src/components/BookingForm.tsx`
- `src/components/ProductCatalog.tsx`
- `src/components/ContactForm.tsx`
- `src/app/contact/page.tsx`
