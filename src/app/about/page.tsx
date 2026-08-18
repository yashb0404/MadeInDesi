import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ProcessFilm } from "@/components/ProcessFilm";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Made In Desi was not born in a factory. It was born on a hospital bed — out of two years of illness, and the conviction that if food can damage the body, it can also protect it.",
};

/**
 * The founder story in the order it happened: the illness, the realisation, the
 * problem it exposed, and what was built in answer. The line the whole brand
 * rests on is pulled out as a quote rather than buried in a paragraph, because
 * it is the one sentence a reader should leave with.
 */

const PROMISES = [
  ["Hygiene", "Small-batch, clean, and careful preparation"],
  ["Quality", "Thoughtfully sourced ingredients"],
  ["Integrity", "No shortcuts, no false claims"],
  ["Intention", "Food made with purpose and responsibility"],
];

const BROKEN = ["Shortcuts", "Artificial ingredients", "False claims", "Mass production"];

const SERVES = [
  "Health-conscious individuals and families",
  "Corporate wellness programs",
  "Bulk and gifting orders",
  "Institutions seeking clean, trustworthy food",
];

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* ---- born from healing ---------------------------------------- */}
      <section className="pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="u-shell">
          <Reveal>
            <p className="u-eyebrow">Born from healing</p>
            <h1 className="u-display text-[clamp(2.25rem,5.4vw,4.5rem)] mt-5 max-w-[16ch]">
              Made In Desi was not born in a factory.
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
              <div className="max-w-[54ch]">
                <p className="text-[1.15rem] leading-relaxed text-[var(--ink-dim)]">
                  It was born on a hospital bed. For nearly two years the founder fought a
                  personal health battle &mdash; an experience that permanently changed her
                  relationship with food.
                </p>
                <p className="mt-5 leading-relaxed text-[var(--ink-dim)]">
                  Those days revealed something modern life forgets: food is not just about taste
                  or convenience. It is about healing, strength, and trust. Every product here
                  reflects the kind of food once trusted in our homes &mdash; handmade, prepared
                  with care, and rooted in intention.
                </p>
                <p className="mt-5 leading-relaxed text-[var(--ink-dim)]">
                  Made In Desi exists to help others live better, eat consciously, and believe in
                  food again.
                </p>
              </div>

              <figure className="lg:pt-2">
                <blockquote className="u-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-leaf-deep">
                  &ldquo;If food can damage the body, it can also protect it.&rdquo;
                </blockquote>
                <figcaption className="u-data text-[var(--ink-faint)] mt-4">
                  The thought everything else was built on
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- the problem ---------------------------------------------- */}
      <section className="u-band py-16 md:py-20">
        <div className="u-shell grid gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="u-eyebrow">The problem we address</p>
            <h2 className="u-display text-[clamp(2rem,5vw,3.5rem)] mt-4 max-w-[16ch]">
              Food today has a trust deficit.
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--ink-dim)] max-w-[46ch]">
              People no longer know what real food is &mdash; how it is made, or what actually
              goes into it. Four things replaced honesty and tradition.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <ul className="grid">
              {BROKEN.map((item, i) => (
                <li
                  key={item}
                  className="u-display py-5 text-[1.35rem] text-[var(--ink-dim)] md:text-[1.55rem]"
                  style={i > 0 ? { borderTop: "1px solid var(--hairline)" } : undefined}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="u-data text-leaf-deep mt-6">That is where Made In Desi was born.</p>
          </Reveal>
        </div>
      </section>

      {/* ---- purpose and promise -------------------------------------- */}
      <section className="py-16 md:py-20">
        <div className="u-shell grid gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="u-eyebrow">Our purpose</p>
            <h2 className="u-display text-[clamp(2rem,5vw,3.5rem)] mt-4 max-w-[18ch]">
              To restore trust in food.
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--ink-dim)] max-w-[46ch]">
              By delivering honest, hygienic, thoughtfully prepared wellness products inspired by
              Indian traditions. Every product carries more than flavour; it carries a promise of
              care.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <p className="u-eyebrow">Our promise</p>
            <dl className="mt-4 grid">
              {PROMISES.map(([term, detail], i) => (
                <div
                  key={term}
                  className="flex items-baseline justify-between gap-8 py-5"
                  style={i > 0 ? { borderTop: "1px solid var(--hairline)" } : undefined}
                >
                  <dt className="u-eyebrow shrink-0">{term}</dt>
                  <dd className="text-right text-sm text-[var(--ink-dim)]">{detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <ProcessFilm />

      {/* ---- who we serve --------------------------------------------- */}
      <section className="py-16 md:py-20">
        <div className="u-shell">
          <Reveal>
            <p className="u-eyebrow">Who we serve</p>
            <h2 className="u-display text-[clamp(2rem,5vw,3.5rem)] mt-4 max-w-[20ch]">
              Anyone who would rather know what they are eating.
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SERVES.map((who, i) => (
                <li key={who} className="u-tin p-5">
                  <span className="u-data text-[var(--ink-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 leading-snug">{who}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Link href="/shop" className="u-btn">
                See the shelf
              </Link>
              <a href="mailto:info@madeindesi.org" className="u-btn u-btn--ghost">
                info@madeindesi.org
              </a>
            </div>
            <p className="u-data text-[var(--ink-faint)] mt-6">
              We bring you health, not just food.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
