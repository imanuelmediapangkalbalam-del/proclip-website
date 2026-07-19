export type ClipMarker = {
  id: string;
  inPoint: number;
  outPoint: number;
  label: string;
  caption: string;
};

export type ProjectMeta = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
  fileName: string;
  fileSize: number;
  clipCount: number;
  thumbnail?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  plan: "FREE" | "PRO";
  credits: number;
};

export const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    credits: 100,
    features: [
      "Client-side FFmpeg export",
      "Timeline + multi-clip trim",
      "Watermark ProClip",
      "Max 2 menit / clip",
      "5 project lokal",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: 19,
    credits: 2000,
    features: [
      "No watermark",
      "Export 1080p batch ZIP",
      "Caption style kit",
      "Priority tips & shortcuts",
      "Siap upgrade server render",
    ],
    highlighted: true,
  },
  {
    id: "AGENCY",
    name: "Agency",
    price: 59,
    credits: 10000,
    features: [
      "Semua Pro",
      "Team seats (phase 2)",
      "Publish API (phase 2)",
      "GPU render queue (phase 2)",
    ],
  },
] as const;

export const FEATURES = [
  {
    title: "Timeline editor",
    body: "Waveform, zoom, multi-clip in/out, keyboard shortcuts ala CapCut.",
  },
  {
    title: "FFmpeg.wasm export",
    body: "Potong & export 9:16 di browser. Video tidak perlu keluar dari perangkat.",
  },
  {
    title: "Auto-clip heuristic",
    body: "Deteksi silence + saran clip cepat — approve atau edit manual.",
  },
  {
    title: "Caption panel",
    body: "Tulis caption per clip, style dasar, siap karaoke di phase berikutnya.",
  },
  {
    title: "ZIP batch download",
    body: "Export beberapa clip sekaligus jadi satu ZIP siap Shorts/Reels/TikTok.",
  },
  {
    title: "Billing-ready",
    body: "Free vs Pro UI + credit model. Stripe webhook siap di phase deploy Vercel.",
  },
] as const;

export const FAQS = [
  {
    q: "Apakah video di-upload ke server?",
    a: "MVP ini memproses di browser lewat FFmpeg.wasm. File tetap lokal di perangkatmu. Mode cloud storage (R2) tersedia di arsitektur phase 2.",
  },
  {
    q: "Kenapa deploy di GitHub Pages?",
    a: "Static export agar bisa live tanpa biaya server. Fitur auth/DB/Stripe penuh butuh Vercel + Neon + R2.",
  },
  {
    q: "Berapa lama video yang didukung?",
    a: "Free: ideal di bawah 10 menit total, clip max ~2 menit. Browser memory membatasi file sangat besar.",
  },
  {
    q: "Apakah ada Whisper / AI caption?",
    a: "Panel caption sudah ada. Whisper.cpp / Transformers.js bisa diaktifkan di phase berikutnya (model ~40MB).",
  },
] as const;
