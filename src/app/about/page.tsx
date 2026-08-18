import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { ScrollSwap } from "@/components/ScrollSwap";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Made In Desi was not born in a factory. It was born on a hospital bed — out of the two years Maaya spent ill, and the conviction that if food can damage the body, it can also protect it.",
};

/**
 * The founder story told as a narration rather than a brochure: six short
 * chapters, one idea each, in the order things actually happened.
 *
 * The page is deliberately narrow and slow. Body copy is capped near 40
 * characters wider than the site's usual measure and set larger, the turns in
 * the story get a line of their own, and the two sentences everything else
 * rests on are lifted out onto their own screens. A reader should be able to
 * take only the large type and still leave with the whole story.
 */

/**
 * A chapter. The marker sits above the prose on the same left edge rather than
 * out in the margin: a story is read top to bottom, and a number off to one
 * side makes the eye travel sideways at every section start for no gain.
 */
function Chapter({
  n,
  label,
  children,
}: {
  n: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="u-shell py-6 md:py-9">
      <div className="max-w-[48ch]">
        <Reveal>
          <p className="u-eyebrow flex items-baseline gap-2.5">
            <span className="text-[var(--ink-faint)]">{n}</span>
            <span aria-hidden="true" className="h-px w-6 bg-[var(--hairline)]" />
            <span>{label}</span>
          </p>
        </Reveal>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

/** The line itself, without a section around it. */
function TurnLine({ steps, note }: { steps: string[]; note?: string }) {
  return (
    <div className="u-shell">
      <p className="u-display max-w-[20ch] text-[clamp(1.9rem,4.6vw,3.5rem)] leading-[1.08] text-leaf-deep">
        {steps.map((part, i) => (
          <span key={part} data-step={i} className="inline-block opacity-0 will-change-[opacity,transform]">
            {part}
            {i < steps.length - 1 ? " " : null}
          </span>
        ))}
      </p>
      {note ? <p className="u-data text-[var(--ink-faint)] mt-5">{note}</p> : null}
    </div>
  );
}

/** A line the story turns on. Given a band and a screen of its own. */
function Turn({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <section className="u-band py-10 md:py-14">
      <div className="u-shell">
        <Reveal>
          <p className="u-display max-w-[20ch] text-[clamp(1.9rem,4.6vw,3.5rem)] leading-[1.08] text-leaf-deep">
            {children}
          </p>
          {note ? <p className="u-data text-[var(--ink-faint)] mt-5">{note}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}

/** Body copy inside a chapter — larger and looser than the rest of the site. */
function Say({ children, lead = false }: { children: ReactNode; lead?: boolean }) {
  return (
    <Reveal>
      <p
        className={
          lead
            ? "text-[1.2rem] leading-[1.75] text-[var(--color-ink)] md:text-[1.35rem]"
            : "mt-4 text-[1.05rem] leading-[1.75] text-[var(--ink-dim)]"
        }
      >
        {children}
      </p>
    </Reveal>
  );
}

const PROMISES = [
  ["Hygiene", "Small batches, made clean and made carefully"],
  ["Quality", "Ingredients chosen on purpose, not on price"],
  ["Integrity", "No shortcuts. No claims we cannot stand behind"],
  ["Intention", "Food made for a reason, by someone responsible for it"],
];

const SERVES = [
  "Families who read the label before they buy",
  "Workplaces that mean it about wellness",
  "Gifting, in bulk, without the plastic",
  "Institutions that need food they can vouch for",
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      {/* ---- the opening ---------------------------------------------- */}
      <section className="u-shell pt-24 pb-4 md:pt-28 md:pb-6">
        <Reveal>
          <p className="u-eyebrow">Our story</p>
          <h1 className="u-display mt-5 max-w-[14ch] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.98]">
            It began on a hospital bed.
          </h1>
          <p className="u-data text-[var(--ink-faint)] mt-6">
            Made In Desi &middot; founded by Maaya &middot; Hyderabad
          </p>
        </Reveal>
      </section>

      {/* ---- 01: the chapter becomes the line it produced -------------- */}
      <ScrollSwap
        first={
    <Chapter n="01" label="Two years">
            <Say lead>
              For nearly two years, Maaya was ill. Not the kind of illness you get over in a
              week &mdash; the kind that rearranges your life while you wait it out.
            </Say>
            <Say>
              She spent those years thinking about food. Not as taste, and not as convenience.
              As the thing going into a body that was trying to repair itself. When you are
              well, you can afford not to ask what is in something. When you are not, the
              question stops being optional.
            </Say>
            <Say>
              What she found when she started reading labels did not reassure her.
            </Say>
          </Chapter>
        }
        second={
          <TurnLine
            steps={["If food can damage the body,", "it can also", "protect it."]}
            note="The thought everything after it was built on"
          />
        }
      />

      {/* ---- 02 ------------------------------------------------------- */}
      <Chapter n="02" label="What she found">
        <Say lead>
          The problem was not one bad product. It was that nobody could tell her what real
          food looked like any more.
        </Say>
        <Say>
          Shortcuts had replaced method. Artificial ingredients had replaced the real ones
          because they keep longer and cost less. Claims on the front of the pack had
          stopped matching the list on the back. And everything was made at a scale where
          no single person was answerable for it.
        </Say>
        <Say>
          Not one of those is a scandal on its own. Together they are why you cannot trust
          a shelf.
        </Say>
      </Chapter>

      {/* ---- 03 ------------------------------------------------------- */}
      <Chapter n="03" label="What she made">
        <Say lead>
          So she started making the food she had wanted to be able to buy.
        </Say>
        <Say>
          Handmade, in small batches, the way it was made in homes before it was made in
          factories. Ladoos and bites bound with dates and jaggery rather than sugar syrup.
          Millet snacks. Things built for people eating around diabetes, or low iron, or a
          body still getting its strength back. Gond, ragi, seed and moringa &mdash;
          ingredients Indian kitchens already trusted, long before anyone called them
          wellness.
        </Say>
        <Say>
          Nothing here is invented. It is remembered.
        </Say>
      </Chapter>

      <Turn note="What each product is actually carrying">
        Every jar carries more than flavour. It carries a promise of care.
      </Turn>

      {/* ---- 04 ------------------------------------------------------- */}
      <Chapter n="04" label="The promise">
        <Say lead>
          A promise is only worth something if you can say what it commits you to. Here is
          ours, in four parts.
        </Say>
        <Reveal>
          <dl className="mt-7 grid">
            {PROMISES.map(([term, detail], i) => (
              <div
                key={term}
                className="py-5"
                style={i > 0 ? { borderTop: "1px solid var(--hairline)" } : undefined}
              >
                <dt className="u-display text-[1.35rem] text-leaf-deep">{term}</dt>
                <dd className="mt-2 leading-relaxed text-[var(--ink-dim)]">{detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Chapter>

      {/* ---- 06 ------------------------------------------------------- */}
      <Chapter n="05" label="Who it is for">
        <Say lead>
          Anyone who would rather know what they are eating.
        </Say>
        <Reveal>
          <ul className="mt-6 grid">
            {SERVES.map((who, i) => (
              <li
                key={who}
                className="py-5 leading-snug text-[var(--ink-dim)]"
                style={i > 0 ? { borderTop: "1px solid var(--hairline)" } : undefined}
              >
                {who}
              </li>
            ))}
          </ul>
        </Reveal>
      </Chapter>

      {/* ---- the close ------------------------------------------------ */}
      <section className="u-shell pt-6 pb-4 md:pt-8">
        <Reveal>
          <p className="u-display max-w-[16ch] text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">
            We bring you health, not just food.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="u-btn">
              See the shelf
            </Link>
            <a href="mailto:info@madeindesi.org" className="u-btn u-btn--ghost">
              info@madeindesi.org
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
