import Link from "next/link";
import { FAQS, FEATURES, PLANS } from "@/lib/constants";
import LandingNav from "@/components/landing/LandingNav";

export default function HomePage() {
  return (
    <div className="grid-glow min-h-screen">
      <LandingNav />

      <section className="shell relative flex min-h-[100svh] flex-col justify-end pb-20 pt-28 md:pb-28">
        <p className="animate-rise brand text-5xl text-text sm:text-7xl md:text-8xl">
          ProClip
        </p>
        <div className="animate-rise mt-4 h-1 w-20 bg-accent" />
        <h1 className="animate-rise mt-8 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Potong video panjang jadi Shorts dalam hitungan menit.
        </h1>
        <p className="animate-rise mt-4 max-w-xl text-base text-muted sm:text-lg">
          Timeline visual, multi-clip trim, auto-suggest, dan export 9:16 lewat
          FFmpeg.wasm — langsung di browser, tanpa antri server.
        </p>
        <div className="animate-rise mt-8 flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-accent">
            Start free
          </Link>
          <a href="#features" className="btn btn-ghost">
            Lihat fitur
          </a>
        </div>
        <div className="animate-rise mt-14 overflow-hidden rounded-xl border border-line bg-bg-elevated shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-warn/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-ok/80" />
            <span className="ml-3 text-xs text-muted">editor.proclip — timeline</span>
          </div>
          <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
            <div className="relative aspect-video bg-gradient-to-br from-bg-soft to-bg p-6">
              <div className="absolute inset-6 rounded-lg border border-dashed border-accent/30 bg-black/30" />
              <div className="absolute bottom-10 left-10 right-10 h-16 rounded-md border border-line bg-bg-elevated/90 p-3">
                <div className="mb-2 flex gap-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-sm bg-accent/70"
                      style={{ height: `${8 + ((i * 17) % 28)}px` }}
                    />
                  ))}
                </div>
                <div className="relative h-2 rounded bg-bg-soft">
                  <div className="absolute left-[18%] right-[42%] top-0 h-full rounded bg-accent/80" />
                </div>
              </div>
            </div>
            <div className="space-y-3 border-t border-line p-5 md:border-l md:border-t-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Clip queue
              </p>
              {["Hook 0:00–0:18", "Tip 0:42–1:05", "CTA 2:10–2:28"].map((c) => (
                <div key={c} className="rounded-lg border border-line bg-bg-soft px-3 py-2 text-sm">
                  {c}
                </div>
              ))}
              <div className="rounded-lg bg-accent/15 px-3 py-2 text-sm text-accent">
                Export ZIP · 9:16 · 1080p
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="shell py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Features</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold md:text-5xl">
          Toolset yang dipakai creator setiap hari.
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="card p-6">
              <h3 className="font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-line bg-bg-elevated/50 py-24">
        <div className="shell">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Pricing</p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">
            Mulai gratis. Scale saat butuh server.
          </h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.id}
                className={`card p-6 ${"highlighted" in plan && plan.highlighted ? "border-accent/50 ring-1 ring-accent/30" : ""}`}
              >
                <p className="text-sm text-muted">{plan.name}</p>
                <p className="mt-2 font-display text-4xl font-semibold">
                  ${plan.price}
                  <span className="text-base font-normal text-muted">/bln</span>
                </p>
                <p className="mt-2 text-sm text-muted">{plan.credits} credits / bulan</p>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex gap-2">
                      <span className="text-accent">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`btn mt-8 w-full ${"highlighted" in plan && plan.highlighted ? "btn-accent" : "btn-ghost"}`}
                >
                  Pilih {plan.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="shell py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-semibold md:text-5xl">Pertanyaan umum</h2>
        <div className="mt-10 space-y-4">
          {FAQS.map((item) => (
            <details key={item.q} className="card group p-5 open:pb-5">
              <summary className="cursor-pointer list-none font-medium marker:content-none">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="shell pb-24">
        <div className="card overflow-hidden p-8 md:flex md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="font-display text-3xl font-semibold">Siap potong clip pertama?</h2>
            <p className="mt-2 max-w-lg text-muted">
              Buat akun demo lokal, upload video, mark in/out, export ZIP.
            </p>
          </div>
          <Link href="/register" className="btn btn-accent mt-6 md:mt-0">
            Mulai sekarang
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="shell flex flex-col gap-2 text-sm text-muted sm:flex-row sm:justify-between">
          <p className="brand text-lg text-text">ProClip</p>
          <p>© {new Date().getFullYear()} ProClip · Video Clipper SaaS MVP</p>
        </div>
      </footer>
    </div>
  );
}
