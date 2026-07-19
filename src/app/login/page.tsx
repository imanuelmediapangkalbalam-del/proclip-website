"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Masukkan email valid");
      return;
    }
    login(email);
    toast.success("Login demo berhasil");
    router.push("/app/");
  }

  return (
    <div className="grid-glow flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-8">
        <Link href="/" className="brand text-2xl">
          ProClip
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-muted">
          Mode demo lokal (tanpa server). Fase berikutnya: NextAuth + Google/GitHub.
        </p>
        <label className="mt-6 block text-sm font-medium">
          Email
          <input
            className="field mt-2"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kamu@email.com"
          />
        </label>
        <button type="submit" className="btn btn-accent mt-6 w-full">
          Masuk ke dashboard
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link href="/register/" className="text-accent hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
