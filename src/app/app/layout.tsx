"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Clapperboard,
  CreditCard,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const nav = [
  { href: "/app/", label: "Overview", icon: LayoutDashboard },
  { href: "/app/projects/", label: "Projects", icon: FolderOpen },
  { href: "/app/editor/", label: "New clip", icon: Clapperboard },
  { href: "/app/billing/", label: "Billing", icon: CreditCard },
  { href: "/app/settings/", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.replace("/login/");
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Memuat sesi...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-bg-elevated md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/" className="brand text-xl">
            ProClip
          </Link>
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
            {user.plan}
          </span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/app/" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap",
                  active ? "bg-bg-soft text-text" : "text-muted hover:bg-bg-soft/60 hover:text-text"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden border-t border-line p-4 md:block">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
          <p className="mt-2 text-xs text-accent">{user.credits} credits</p>
          <button
            type="button"
            className="btn btn-ghost mt-3 w-full"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-8">{children}</main>
    </div>
  );
}
