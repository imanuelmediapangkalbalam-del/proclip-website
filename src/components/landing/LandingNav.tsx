"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between">
        <Link href="/" className="brand text-2xl text-text">
          ProClip
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted hover:text-text">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link href="/app" className="btn btn-accent">
              Buka dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link href="/register" className="btn btn-accent">
                Start free
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="btn btn-ghost md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-bg px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-muted">
                {l.label}
              </a>
            ))}
            <Link href={user ? "/app/" : "/register/"} className="btn btn-accent mt-2">
              {user ? "Dashboard" : "Start free"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
