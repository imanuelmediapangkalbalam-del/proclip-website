"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WA_NUMBER = "6281234567890";
const WA_TEXT = encodeURIComponent(
  "Halo ProClip, saya ingin tanya produk / booking kursi."
);

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 bg-ink px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] hover:bg-black"
      aria-label="Chat WhatsApp ProClip"
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp
    </motion.a>
  );
}
