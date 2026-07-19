import Link from "next/link";

const columns = [
  {
    title: "Jelajahi",
    links: [
      { name: "Produk", href: "/products" },
      { name: "Gallery", href: "/gallery" },
      { name: "Book Studio", href: "/booking" },
      { name: "Tentang", href: "/about" },
    ],
  },
  {
    title: "Dukungan",
    links: [
      { name: "Kontak", href: "/contact" },
      { name: "Garansi blade", href: "/contact" },
      { name: "Dealer inquiry", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-ink text-white">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="brand-mark text-3xl">ProClip</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            Clipper profesional dan studio barbershop. Dibangun untuk barber yang
            butuh kontrol — dan klien yang menuntut hasil.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              {col.title}
            </p>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/75 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="section-shell flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} ProClip. All rights reserved.</p>
        <p>Studio · Pangkalbalam</p>
      </div>
    </footer>
  );
}
