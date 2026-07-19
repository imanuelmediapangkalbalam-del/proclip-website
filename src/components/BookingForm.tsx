"use client";

import { FormEvent, useMemo, useState } from "react";
import { services, formatIDR } from "@/lib/data";
import { cn } from "@/lib/utils";

const hours = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

function nextDays(count: number) {
  const days: { label: string; value: string }[] = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      value: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    });
  }
  return days;
}

export default function BookingForm() {
  const days = useMemo(() => nextDays(7), []);
  const [service, setService] = useState(services[0].name);
  const [day, setDay] = useState(days[0].value);
  const [hour, setHour] = useState(hours[2]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const selected = services.find((s) => s.name === service) ?? services[0];

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = encodeURIComponent(
      [
        "Booking ProClip Studio",
        `Nama: ${name}`,
        `WA: ${phone}`,
        `Layanan: ${service}`,
        `Tanggal: ${day}`,
        `Jam: ${hour}`,
        note ? `Catatan: ${note}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
    setDone(true);
  }

  if (done) {
    return (
      <div className="border border-[var(--line)] bg-surface p-8 md:p-10">
        <p className="font-display text-2xl font-semibold text-ink">
          Booking siap dikirim.
        </p>
        <p className="mt-3 text-steel">
          Chat WhatsApp sudah terbuka. Kirim pesan untuk konfirmasi slot{" "}
          {selected.name} · {day} · {hour}.
        </p>
        <button
          type="button"
          className="btn btn-outline mt-6"
          onClick={() => setDone(false)}
        >
          Buat booking lain
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-[var(--line)] bg-surface p-6 shadow-[var(--shadow)] md:p-10"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Pilih layanan</legend>
        <div className="mt-4 grid gap-3">
          {services.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setService(s.name)}
              data-active={service === s.name}
              className={cn("field-slot text-left", service === s.name && "ring-0")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="mt-1 text-sm text-steel">{s.detail}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-ink">{formatIDR(s.price)}</p>
                  <p className="text-steel">{s.duration}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-ink">Tanggal</legend>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => setDay(d.value)}
              data-active={day === d.value}
              className="field-slot min-w-[5.5rem] shrink-0 text-center text-sm"
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold text-ink">Jam</legend>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {hours.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHour(h)}
              data-active={hour === h}
              className="field-slot text-sm font-medium"
            >
              {h}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">Nama</span>
          <input
            className="field"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            WhatsApp
          </span>
          <input
            className="field"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold text-ink">
          Catatan (opsional)
        </span>
        <textarea
          className="field min-h-24"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Referensi potongan, panjang, dll."
        />
      </label>

      <button type="submit" className="btn btn-signal mt-8 w-full sm:w-auto">
        Konfirmasi via WhatsApp
      </button>
    </form>
  );
}
