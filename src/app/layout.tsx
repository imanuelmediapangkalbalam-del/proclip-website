import type { Metadata } from "next";
import { Syne, Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppFloat from "@/components/WhatsAppFloat";

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
    default: "ProClip — Professional Clippers & Barbershop Studio",
    template: "%s · ProClip",
  },
  description:
    "ProClip builds studio-grade clippers and runs a precision barbershop. Tools for barbers who demand control — and chairs for clients who expect it.",
  keywords: [
    "ProClip",
    "professional clipper",
    "barbershop",
    "fade",
    "trimmer",
    "grooming tools",
  ],
  openGraph: {
    title: "ProClip — Professional Clippers & Barbershop Studio",
    description:
      "Studio-grade clippers and precision barbershop craft. Built for barbers. Ready for the chair.",
    type: "website",
    locale: "id_ID",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: "ProClip",
  description:
    "Professional clippers and precision barbershop studio.",
  url: "https://github.com/imanuelmediapangkalbalam-del/proclip-website",
  image:
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pangkalbalam",
    addressCountry: "ID",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "21:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${syne.variable} ${figtree.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
