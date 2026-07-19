"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Masukkan email valid");
      return;
    }
    login(email, name || undefined);
    toast.success("Akun demo dibuat");
    router.push("/app/");
  }

  return (
    <div className="grid-glow flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-8">
        <Link href="/" className="brand text-2xl">
          ProClip
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold">Start free</h1>
        <p className="mt-2 text-sm text-muted">
          100 credits · watermark · export client-side unlimited (batas browser).
        </p>
        <label className="mt-6 block text-sm font-medium">
          Nama
          <input
            className="field mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kamu"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
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
          Buat akun & lanjut
        </button>
        <p className="mt-4 text-center text-sm text-muted">
          Sudah punya akun?{" "}
          <Link href="/login/" className="text-accent hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
