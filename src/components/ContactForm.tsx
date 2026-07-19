"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = encodeURIComponent(
      [
        "Pesan dari website ProClip",
        `Nama: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Topik: ${data.get("topic")}`,
        `Pesan: ${data.get("message")}`,
      ].join("\n")
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-[var(--line)] bg-surface p-8">
        <p className="font-display text-2xl font-semibold text-ink">
          Pesan siap dikirim.
        </p>
        <p className="mt-3 text-steel">
          Lanjutkan di WhatsApp agar tim ProClip bisa membalas lebih cepat.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-[var(--line)] bg-surface p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Nama</span>
          <input name="name" required className="field" />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">Email</span>
          <input name="email" type="email" required className="field" />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold">Topik</span>
        <select name="topic" className="field" defaultValue="Produk">
          <option>Produk</option>
          <option>Dealer</option>
          <option>Garansi</option>
          <option>Studio</option>
        </select>
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold">Pesan</span>
        <textarea name="message" required className="field min-h-32" />
      </label>
      <button type="submit" className="btn btn-signal mt-6">
        Kirim via WhatsApp
      </button>
    </form>
  );
}
