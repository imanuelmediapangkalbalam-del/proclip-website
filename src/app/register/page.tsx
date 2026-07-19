"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const loginLocal = useAuthStore((s) => s.login);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gagal daftar");
        return;
      }
      await signIn("credentials", { email, password, redirect: false });
      loginLocal(email, name || undefined);
      toast.success(data.demo ? "Akun demo siap" : "Akun dibuat");
      router.push("/app");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid-glow flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-8">
        <Link href="/" className="brand text-2xl">
          ProClip
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold">Start free</h1>
        <p className="mt-2 text-sm text-muted">
          100 credits · watermark · FFmpeg client export.
        </p>
        <label className="mt-6 block text-sm font-medium">
          Nama
          <input className="field mt-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Email
          <input
            className="field mt-2"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            className="field mt-2"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-accent mt-6 w-full" disabled={loading}>
          {loading ? "Membuat..." : "Buat akun"}
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
