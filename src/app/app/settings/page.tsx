"use client";

import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-muted">Profil demo lokal. NextAuth sync di phase 2.</p>

      <div className="card mt-8 space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Nama</p>
          <p className="mt-1 font-medium">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Email</p>
          <p className="mt-1 font-medium">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Default aspect</p>
          <p className="mt-1 font-medium">9:16 (TikTok / Reels / Shorts)</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => toast.message("API keys & caption styles: phase 2")}
        >
          Caption styles / API keys
        </button>
      </div>
    </div>
  );
}
