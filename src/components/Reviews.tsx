import { Quote } from "lucide-react";
import { reviewRows, type Review } from "@/lib/reviews";

/**
 * Two rows of real customer reviews, drifting in opposite directions.
 *
 * Deliberately plain: no star graphics, no invented avatars, no gradient
 * borders. The quote and a first name are the whole card, because the quotes
 * are real and the ornament would only make them look less so.
 *
 * The animation is CSS — see `.u-marquee`. Each row renders its list twice so
 * the -50% slide loops seamlessly; the duplicate is hidden from screen readers
 * so the quotes are not announced twice.
 */

function Card({ review }: { review: Review }) {
  return (
    <figure className="u-tin w-[19rem] md:w-[23rem] shrink-0 mx-3 p-6 flex flex-col">
      <Quote size={18} strokeWidth={1.6} className="text-turmeric shrink-0" aria-hidden />

      <blockquote className="mt-4 text-[var(--ink-dim)] leading-relaxed text-[0.95rem] flex-1">
        {review.quote}
      </blockquote>

      <figcaption className="mt-5 flex items-baseline justify-between gap-4">
        <span className="u-display text-lg">{review.name}</span>
        {review.item && <span className="u-data text-[var(--ink-faint)]">{review.item}</span>}
      </figcaption>
    </figure>
  );
}

function Row({ items, reverse, seconds }: { items: Review[]; reverse?: boolean; seconds: number }) {
  return (
    <div className="u-marquee-row overflow-hidden">
      <div
        className={`u-marquee ${reverse ? "u-marquee--reverse" : ""}`}
        style={{ "--dur": `${seconds}s` } as React.CSSProperties}
      >
        {items.map((r) => (
          <Card key={r.id} review={r} />
        ))}
        {/* The seamless half. Duplicated visually, silent to assistive tech. */}
        <div className="flex" aria-hidden>
          {items.map((r) => (
            <Card key={`${r.id}-echo`} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Reviews() {
  const [top, bottom] = reviewRows();

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="u-shell">
        <p className="u-eyebrow">What people say</p>
        <h2 className="u-display text-[clamp(2rem,5vw,3.5rem)] mt-3 max-w-[20ch]">
          Straight from our kitchen to your table.
        </h2>
      </div>

      {/*
        Edges are masked rather than cut, so cards arrive and leave instead of
        appearing at a hard boundary.
      */}
      <div
        className="mt-12 space-y-6"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        <Row items={top} seconds={78} />
        <Row items={bottom} reverse seconds={92} />
      </div>
    </section>
  );
}
