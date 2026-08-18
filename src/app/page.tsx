import Link from "next/link";
import Image from "next/image";
import { Check, HandHeart } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { ProductShot } from "@/components/ProductShot";
import { CursorTrail } from "@/components/CursorTrail";
import { Reviews } from "@/components/Reviews";
import { ProcessFilm } from "@/components/ProcessFilm";
import { bestsellers, PRODUCTS, NEEDS } from "@/lib/products";

/** Who each box is actually for. This is how the client sells, so it leads. */
const AUDIENCE = [
  {
    need: "kids-elders" as const,
    who: "Kids who won't chew, elders who can't",
    what: "Mixed Berry & Nuts, set soft on purpose. Coarse-chopped nuts, nothing hard to work through.",
    slug: "mixed-berry-nuts",
  },
  {
    need: "everyday" as const,
    who: "Anyone skipping breakfast",
    what: "Nutrition Balls. One at 11am instead of the thing from the vending machine.",
    slug: "nutrition-balls",
  },
  {
    need: "hair-skin" as const,
    who: "Anyone told to eat more seeds",
    what: "Biotin Bites. Black sesame, sunflower and flax, which is where the biotin actually lives.",
    slug: "biotin-bites",
  },
  {
    need: "bones-blood" as const,
    who: "Anyone eating for two, or recovering",
    what: "Calcium & Iron Balls. Sesame and ragi, dates and ragi — the pairing your grandmother already knew.",
    slug: "calcium-iron-balls",
  },
];

export default function Home() {
  const picks = bestsellers();

  return (
    <>
      {/*
        ---- hero -------------------------------------------------------
        Photography, not a canvas. Type on the left holds a fixed measure;
        the photograph sits in an arch on the right — the shape of a temple
        doorway, and the one place the page allows a big radius.
      */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
        {/* Warm wash behind the photograph so the arch has something to sit on. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(72% 64% at 80% 34%, color-mix(in oklab, var(--color-turmeric) 34%, transparent), color-mix(in oklab, var(--color-turmeric) 12%, transparent) 48%, transparent 74%)",
          }}
        />

        {/*
          Sits above the wash but before the content, so it trails behind the
          type. Held back here — the hero already has the arch and the arcs
          working, so the trail stays a suggestion.
        */}
        <CursorTrail opacity={0.28} />

        <div className="u-shell relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:items-center">
          <div>
            <Reveal>
              <p className="u-eyebrow">Hyderabad · rolled by hand</p>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="u-display text-[clamp(2.25rem,5.4vw,4.5rem)] mt-5 max-w-[19ch]">
                If food can damage the body, it can also protect it.
              </h1>
            </Reveal>

            <Reveal delay={260}>
              <p className="mt-7 max-w-[44ch] text-[var(--ink-dim)] leading-relaxed md:text-lg">
                No sugar syrup, no binder, no shelf-life chemistry. Small batches, rolled the
                morning they ship.
              </p>
            </Reveal>

            <Reveal delay={380}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/shop" className="u-btn">
                  Shop the shelf
                </Link>
                <Link href="#kitchen" className="u-btn u-btn--ghost">
                  What goes in
                </Link>
              </div>
            </Reveal>

            <Reveal delay={480}>
              <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
                {[
                  ["4", "ingredients, typically"],
                  ["0", "added sugar"],
                  ["21", "day shelf life"],
                ].map(([n, label]) => (
                  <div key={label}>
                    <dt className="u-display text-[2rem] leading-none text-leaf-deep">{n}</dt>
                    <dd className="u-data text-[var(--ink-faint)] mt-1.5">{label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            {/*
              Concentric arcs echoing the arch above the photograph. The viewBox
              is 200 units across the frame's own width, so the arch radius is
              exactly 100 — every arc here is struck from the same centre and
              reads as a halo around it rather than a shape of its own.
            */}
            <svg
              aria-hidden
              viewBox="0 0 200 200"
              className="absolute inset-x-0 top-0 w-full aspect-square overflow-visible pointer-events-none"
              fill="none"
            >
              <defs>
                <filter id="arc-soften" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1" />
                </filter>
              </defs>

              <g filter="url(#arc-soften)">
                {[116, 138, 160].map((r, i) => (
                  <path
                    key={r}
                    d={`M${100 - r},100 A${r},${r} 0 0 1 ${100 + r},100`}
                    stroke="var(--color-turmeric)"
                    strokeWidth={0.4}
                    strokeOpacity={0.3 - i * 0.08}
                    strokeLinecap="round"
                  />
                ))}
              </g>
            </svg>

            <div
              className="relative aspect-[4/5] w-full overflow-hidden"
              style={{ borderRadius: "50vw 50vw 14px 14px" }}
            >
              <Image
                src="/products/nutrition-balls.jpg"
                alt="Nutrition balls, rolled that morning"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 92vw"
                className="object-cover"
              />
            </div>

            {/*
              The claims, overlapped at the corner. A second photograph here
              only repeated what the arch already says; the things a buyer
              actually checks for do more work in the same space.
            */}
            {/*
              Each chip leads with the thing that actually stops someone — the
              oil, the count, the destination — set large, with the explanation
              under it small. "Cold-pressed oils" was a spec; "Fresh oil, every
              single batch" is the reason anyone cares about the spec.
            */}
            <ul className="absolute -bottom-7 -left-4 md:-left-14 flex flex-col items-start gap-2.5">
              {[
                { punch: "Fresh oil", note: "every single batch" },
                { punch: "Zero", note: "preservatives, ever" },
                { punch: "Shipped to London", note: "and across India" },
              ].map((chip, i) => (
                <li
                  key={chip.punch}
                  /* Staggered so they read as separate chips, not a stack. */
                  className="flex items-center gap-2.5 rounded-full py-2 pl-2.5 pr-5 backdrop-blur-sm"
                  style={{
                    marginLeft: `${i * 0.7}rem`,
                    background: "color-mix(in oklab, var(--color-surface) 88%, transparent)",
                    boxShadow: "var(--lift)",
                  }}
                >
                  <span
                    aria-hidden
                    className="grid place-items-center w-5 h-5 rounded-full shrink-0 text-canvas"
                    style={{ background: "var(--color-leaf)" }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="leading-none whitespace-nowrap">
                    <span className="u-display text-[0.95rem] tracking-tight">{chip.punch}</span>
                    <span className="u-data text-[var(--ink-faint)] ml-1.5">{chip.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---- the process film ------------------------------------- */}
      <ProcessFilm />

      {/* ---- who it's for -------------------------------------------- */}
      <section id="who" className="u-band py-16 md:py-20">
        <div className="u-shell">
          <Reveal>
            <p className="u-eyebrow">Who it&rsquo;s for</p>
            <h2 className="u-display text-[clamp(2rem,5vw,3.75rem)] mt-4 max-w-[20ch]">
              We didn&rsquo;t start with flavours. We started with people.
            </h2>
          </Reveal>

          {/*
            Each audience is a card carrying the actual product photograph, so
            the answer to "who is this for" arrives with the thing itself rather
            than as a row of text.
          */}
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {AUDIENCE.map((row, i) => {
              const label = NEEDS.find((n) => n.id === row.need)?.label ?? row.need;
              const product = PRODUCTS.find((p) => p.slug === row.slug);
              return (
                <Reveal key={row.slug} delay={i * 90}>
                  <Link
                    href={`/product/${row.slug}`}
                    className="u-tin group flex h-full items-stretch gap-5 overflow-hidden p-4 md:p-5"
                  >
                    {product && (
                      <ProductShot
                        product={product}
                        className="w-24 md:w-32 shrink-0 self-stretch rounded-lg min-h-[7rem]"
                        sizes="128px"
                      />
                    )}

                    <div className="flex flex-col min-w-0 py-1">
                      <span className="u-eyebrow">{label}</span>
                      <p className="u-display text-[1.35rem] md:text-[1.55rem] mt-2 group-hover:text-leaf-deep transition-colors">
                        {row.who}
                      </p>
                      <p className="text-sm text-[var(--ink-dim)] mt-2 leading-relaxed">
                        {row.what}
                      </p>
                      <span className="u-data text-leaf-deep mt-auto pt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        See it →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- the shelf ----------------------------------------------- */}
      <section className="py-16 md:py-20">
        <div className="u-shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="u-eyebrow">Most ordered</p>
              <h2 className="u-display text-[clamp(2rem,5vw,3.5rem)] mt-3">Start here</h2>
            </div>
            <Link href="/shop" className="u-btn u-btn--ghost">
              All {PRODUCTS.length} products
            </Link>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProductCard product={p} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reviews />

      {/*
        The logo's hands-into-a-heart, sat exactly on the seam where the page
        colour drifts into the band. It marks the join instead of decorating a
        gap — the blend is already doing the work, this just signs it.
      */}
      <div aria-hidden className="relative z-[2] flex justify-center h-0">
        <span
          className="grid place-items-center w-12 h-12 rounded-full -translate-y-1/2 text-leaf"
          style={{
            background: "var(--color-canvas)",
            border: "1px solid var(--hairline)",
          }}
        >
          <HandHeart size={20} strokeWidth={1.5} />
        </span>
      </div>

      {/* ---- the kitchen --------------------------------------------- */}
      <section id="kitchen" className="u-band py-16 md:py-20">
        <div className="u-shell grid gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal>
            <p className="u-eyebrow">The kitchen</p>
            <h2 className="u-display text-[clamp(2rem,5vw,3.75rem)] mt-4">
              The short list is the point.
            </h2>
            <p className="mt-6 text-[var(--ink-dim)] leading-relaxed max-w-[48ch]">
              Every box is dates or figs for the bind, whole nuts folded in rather than ground,
              seeds toasted the same morning, and a little ghee. That is the entire method. It is
              also why they last three weeks and not six months.
            </p>
            <p className="mt-4 text-[var(--ink-dim)] leading-relaxed max-w-[48ch]">
              We roll to order on Monday and Thursday. If something is out, it is because it
              hasn&rsquo;t been made yet.
            </p>
          </Reveal>

          <Reveal delay={140}>
            {/*
              Rows are separated by their own top rule and stay transparent.
              Filling each row with the band colour used to paint a solid block
              over the band's fade, which cut a hard line across the blend.
            */}
            <dl className="grid">
              {[
                ["Sweetened with", "Dates, figs, palm jaggery"],
                ["Never", "Refined sugar, glucose syrup, preservatives"],
                ["Fat", "Ghee and the oil already in the nuts"],
                ["Made", "To order, Monday and Thursday"],
                ["Keeps", "21 days, airtight, away from sun"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className="py-5 flex items-baseline justify-between gap-8"
                  style={i > 0 ? { borderTop: "1px solid var(--hairline)" } : undefined}
                >
                  <dt className="u-eyebrow shrink-0">{k}</dt>
                  <dd className="text-right text-[var(--ink-dim)] text-sm">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---- close --------------------------------------------------- */}
      <section className="relative overflow-hidden py-16 md:py-20 text-center">
        <CursorTrail opacity={0.65} />

        <div className="u-shell relative">
          <Reveal>
            <h2 className="u-display text-[clamp(2.25rem,7vw,5.5rem)] max-w-[18ch] mx-auto">
              Rolled Monday. At your door Wednesday.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <Link href="/shop" className="u-btn mt-10">
              Shop the shelf
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
