import type { Metadata } from "next";
import { Syne, Figtree } from "next/font/google";
import { Toaster } from "sonner";
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
    "Potong video panjang jadi Shorts/Reels/TikTok di browser. Timeline editor, auto-clip, FFmpeg.wasm export, ZIP download.",
  metadataBase: new URL("https://imanuelmediapangkalbalam-del.github.io/proclip-website"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${syne.variable} ${figtree.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
