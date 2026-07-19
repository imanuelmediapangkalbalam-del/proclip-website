import type { Metadata } from "next";
import { Syne, Figtree } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ProClip — Video Clipper SaaS",
    template: "%s · ProClip",
  },
  description:
    "All-in-one video clipper: upload/URL import, timeline, Whisper captions, auto-reframe 9:16, FFmpeg export, Stripe billing.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${syne.variable} ${figtree.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          {children}
          <Toaster theme="dark" position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
