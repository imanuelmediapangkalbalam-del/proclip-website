import { features } from "@/lib/data";
import Reveal from "@/components/Reveal";

export default function TechFeatures() {
  return (
    <section id="teknologi" className="bg-ink py-24 text-white md:py-32">
      <div className="section-shell">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
            Teknologi
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
            Dibangun untuk jam sibuk, bukan demo singkat.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {features.map((item, i) => (
            <Reveal key={item.title} delay={0.08 * i}>
              <div className="border-t border-white/15 pt-6">
                <p className="text-sm font-semibold text-signal">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
