# ProClip — Video Clipper SaaS

Potong video panjang jadi Shorts / Reels / TikTok. MVP client-side (FFmpeg.wasm) + siap scale ke Vercel/Neon/Stripe/R2.

## Live (GitHub Pages)

Setelah Actions hijau & Pages enabled:

**https://imanuelmediapangkalbalam-del.github.io/proclip-website/**

## MVP yang sudah jalan

- Landing SaaS (features, pricing, FAQ)
- Auth demo lokal (localStorage)
- Dashboard: overview, projects, billing, settings
- Editor: drag-drop upload, preview 16:9/9:16, timeline, mark in/out, multi-clip
- Keyboard: Space, I/O, ←/→, Shift+←/→
- Auto-clip (silence heuristic + fallback segment)
- Caption panel per clip
- Export batch ZIP 9:16 via FFmpeg.wasm (+ watermark Free)
- Prisma schema lengkap (phase 2)
- `.env.example` untuk Neon / Stripe / R2 / Upstash

## Belum di phase MVP (butuh server)

- NextAuth OAuth + Prisma DB
- Uppy/Tus → Cloudflare R2
- Whisper.cpp / AssemblyAI
- MediaPipe face reframe
- Stripe webhook production
- BullMQ / Remotion server render
- Publish TikTok / IG / YouTube

## Stack keputusan (ADR)

| Keputusan | Pilihan MVP | Alasan |
|-----------|-------------|--------|
| Processing | FFmpeg.wasm single-thread | $0, privacy, jalan di GitHub Pages tanpa COOP/COEP |
| Storage project | localStorage | Static export, no DB |
| Auth | Demo local | Tidak ada server session di Pages |
| Deploy | GitHub Pages + Actions | Sesuai request deploy di GitHub |
| Phase 2 | Vercel + Neon + R2 + Stripe | Full SaaS PRD |

## Local dev

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Build static

```bash
# lokal tanpa basePath
npm run build

# seperti GitHub Pages
set GITHUB_PAGES=true
npm run build
```

Output: folder `out/`

## Enable GitHub Pages

1. Repo → **Settings → Pages**
2. Source: **GitHub Actions**
3. Push ke `master` → workflow **Deploy GitHub Pages**
4. Tunggu deploy selesai

## Phase 2 next steps

1. Hapus `output: 'export'` (atau buat dual mode)
2. `npx prisma migrate deploy` ke Neon
3. Auth.js v5 + Google/GitHub
4. Stripe products + webhook
5. R2 presigned upload
6. Optional: Whisper via `@xenova/transformers`

Lihat `prisma/schema.prisma` dan `.env.example`.
