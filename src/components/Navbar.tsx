"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Produk", href: "/products" },
  { name: "Teknologi", href: "/#teknologi" },
  { name: "Gallery", href: "/gallery" },
  { name: "Studio", href: "/booking" },
  { name: "Tentang", href: "/about" },
  { name: "Kontak", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-[var(--line)] bg-paper/90 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="section-shell flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="brand-mark text-2xl text-ink md:text-[1.75rem]">
          ProClip
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-steel transition-colors hover:text-ink"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/booking" className="btn btn-signal hidden sm:inline-flex">
            Book kursi
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-[var(--line)] bg-surface text-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-[var(--line)] bg-paper lg:hidden"
          >
            <div className="section-shell flex flex-col gap-1 py-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-lg font-medium text-ink"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="btn btn-signal mt-4 w-full"
              >
                Book kursi
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
