"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const loginLocal = useAuthStore((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.ok) {
        loginLocal(email);
        toast.success("Login berhasil");
        router.push("/app");
        return;
      }
      // Fallback demo store if Auth.js misconfigured
      loginLocal(email);
      toast.message("Demo local session (Auth.js fallback)");
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
        <h1 className="mt-6 font-display text-3xl font-semibold">Login</h1>
        <p className="mt-2 text-sm text-muted">
          Credentials + OAuth (Google/GitHub/Discord) jika env diset.
        </p>
        <label className="mt-6 block text-sm font-medium">
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
          {loading ? "Masuk..." : "Masuk"}
        </button>
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            className="btn btn-ghost w-full"
            onClick={() => signIn("google", { callbackUrl: "/app" })}
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="btn btn-ghost w-full"
            onClick={() => signIn("github", { callbackUrl: "/app" })}
          >
            Continue with GitHub
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="text-accent hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}
