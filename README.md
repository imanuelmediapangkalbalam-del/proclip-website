# ProClip — Video Clipper SaaS (All-in-One)

Full-stack architecture: Next.js App Router + Prisma + Auth.js + FFmpeg.wasm + Whisper (Transformers.js) + MediaPipe reframe + R2 upload + Stripe + Upstash queues.

## Important: Deploy target

| Target | Status |
|--------|--------|
| **Vercel + Neon + R2 + Upstash** | **Production path (required for API/Auth/Stripe)** |
| GitHub Pages | Tidak cocok untuk full SaaS (tidak ada server/API). Workflow Pages diganti jadi info-only. |

Demo lokal tetap jalan **tanpa** DB (credentials demo + localStorage + client FFmpeg).

## Quick start

```bash
npm install
npx prisma generate
cp .env.example .env   # isi DATABASE_URL, NEXTAUTH_SECRET, dll
npm run dev
```

Buka http://localhost:3000

## Fitur yang sudah di-wire

- Landing + pricing + FAQ
- Auth.js v5: Credentials (+ Google/GitHub/Discord jika env ada)
- Register API + demo mode tanpa DB
- Dashboard + editor timeline (I/O, Space, frame step)
- Upload file lokal + **URL import API** (queue yt-dlp worker)
- Auto-clip API (silence + keyword)
- **Whisper tiny** client (`@xenova/transformers`)
- **Auto-reframe** MediaPipe face / center fallback
- Export ZIP 9:16 FFmpeg.wasm + watermark Free
- Stripe portal + webhook routes (aktif jika key ada)
- R2 presign upload routes
- Prisma schema lengkap
- Workers stubs di `workers/`
- PWA manifest
- COOP/COEP headers (non-Pages build)

## Env wajib production

Lihat `.env.example`:

- `DATABASE_URL` (Neon)
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL`
- OAuth clients (opsional)
- `R2_*`
- `STRIPE_*`
- `UPSTASH_REDIS_REST_URL` / `TOKEN`

## Vercel deploy

1. Import repo ke Vercel
2. Set semua env
3. Build command: `prisma generate && next build`
4. Jalankan `prisma migrate deploy` (Neon)
5. Stripe webhook → `https://<domain>/api/billing/webhook`

## URL import (yt-dlp)

Deploy folder `workers/` ke Railway/Render dengan binary yt-dlp, konsumsi queue `download-url` dari Upstash.

## ADR

1. **FFmpeg.wasm client** untuk Free tier (gratis, privacy)
2. **Whisper via Transformers.js** (bukan compile whisper.cpp manual) — DX lebih mudah
3. **Prisma 6** (bukan 7) — schema `url = env(...)` standar
4. **Hybrid auth** — Auth.js + localStorage fallback untuk demo offline
5. **Production = Vercel**, bukan GitHub Pages
