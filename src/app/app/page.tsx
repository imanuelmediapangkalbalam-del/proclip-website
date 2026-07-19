"use client";

import Link from "next/link";
import { Clapperboard, FolderOpen, Sparkles } from "lucide-react";
import { useAuthStore, useProjectStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";

export default function AppHomePage() {
  const user = useAuthStore((s) => s.user);
  const projects = useProjectStore((s) => s.projects);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">
        Halo, {user?.name}
      </h1>
      <p className="mt-2 text-muted">
        Upload video panjang, tandai clip, export Shorts 9:16 di browser.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Plan</p>
          <p className="mt-2 text-2xl font-semibold">{user?.plan}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Credits</p>
          <p className="mt-2 text-2xl font-semibold">{user?.credits}</p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-wider text-muted">Projects</p>
          <p className="mt-2 text-2xl font-semibold">{projects.length}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/app/editor" className="btn btn-accent">
          <Clapperboard className="h-4 w-4" />
          New clip project
        </Link>
        <Link href="/app/projects" className="btn btn-ghost">
          <FolderOpen className="h-4 w-4" />
          Semua project
        </Link>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h2 className="font-display text-xl font-semibold">Recent</h2>
        </div>
        {!projects.length ? (
          <div className="card p-8 text-center text-muted">
            Belum ada project. Mulai dengan upload video pertama.
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/app/editor/?id=${p.id}`}
                className="card flex items-center justify-between gap-4 p-4 transition hover:border-accent/40"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-muted">
                    {p.fileName} · {formatDuration(p.duration)} · {p.clipCount} clips
                  </p>
                </div>
                <span className="text-xs text-muted">
                  {new Date(p.updatedAt).toLocaleDateString("id-ID")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
