"use client";

import { useEffect, useRef } from "react";

/**
 * How the pickle is made, told in one continuous overhead shot.
 *
 * The film costs 1.8MB and sits below the fold, so nothing is fetched until
 * the reader is within half a screen of it. It loops while it is in view and
 * pauses the moment it leaves — a video decoding against an empty screen is
 * battery spent on nobody.
 */

const STAGES = [
  { punch: "Whole", note: "nothing powdered, nothing pre-cut" },
  { punch: "Cut that morning", note: "one pass, by hand" },
  { punch: "Oil and spice", note: "cold-pressed mustard oil" },
  { punch: "Sealed", note: "cloth, twine, no preservative" },
];

const SRC = "/video/pickle-process.mp4";
const POSTER = "/video/pickle-process-poster.jpg";

export function ProcessFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const play = () => {
      if (!video.getAttribute("src")) {
        video.setAttribute("src", SRC);
        video.load();
      }
      if (still) return; // The poster and the steps say it well enough.
      video.play().catch(() => {
        /* Autoplay refused: the poster stays, which is a fine outcome. */
      });
    };

    // Half a screen of warning, so the first frame is ready by the time the
    // film is actually looked at.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : video.pause()),
      { rootMargin: "50% 0px" },
    );
    io.observe(video);

    // Last resort. If the observer never fires, the film still arrives rather
    // than sitting as a poster forever.
    const failsafe = window.setTimeout(() => {
      if (video.getBoundingClientRect().top < window.innerHeight * 1.5) play();
    }, 4000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <section aria-label="How the pickle is made" className="u-band py-16 md:py-20">
      <div className="u-shell">
        <p className="u-eyebrow">In our kitchen</p>
        <h2 className="u-display text-[clamp(2rem,5vw,3.75rem)] mt-4 max-w-[18ch]">
          Whole in the morning, sealed by the afternoon.
        </h2>
      </div>

      {/* Edge to edge: the shot is wide and overhead, and it reads better with
          nothing framing it. */}
      <video
        ref={videoRef}
        className="mt-8 aspect-[112/58] w-full object-cover md:mt-10"
        poster={POSTER}
        muted
        playsInline
        loop
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="u-shell">
        <ol className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 md:mt-10 md:grid-cols-4">
          {STAGES.map(({ punch, note }, i) => (
            <li key={punch} className="pt-4" style={{ borderTop: "1px solid var(--hairline)" }}>
              <span className="u-data text-[var(--ink-faint)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="u-display mt-2 text-[1.15rem] leading-tight">{punch}</p>
              <p className="u-data text-[var(--ink-faint)] mt-1.5 leading-snug">{note}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
