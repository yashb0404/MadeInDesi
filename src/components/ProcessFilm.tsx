"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";

/**
 * A pinned film that the reader scrubs by scrolling: the section is taller than
 * the viewport, and the distance travelled through it maps onto the video's
 * timeline. Nobody presses play, and nobody waits — the pour happens at exactly
 * the speed they scroll it.
 *
 * The video is decoded on demand rather than played, so `currentTime` is driven
 * from a rAF loop that eases toward the scroll target. Seeking straight to the
 * raw value looks stepped on a trackpad; the easing is what makes it read as
 * footage instead of a slider.
 */

const STAGES = [
  { at: 0.0, punch: "Whole", note: "nothing powdered, nothing pre-cut" },
  { at: 0.24, punch: "Cut that morning", note: "one pass, by hand" },
  { at: 0.52, punch: "Oil and spice", note: "cold-pressed mustard oil" },
  { at: 0.82, punch: "Sealed", note: "cloth, twine, no preservative" },
];

export function ProcessFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    // Reduced motion gets the first frame and the captions, held still — the
    // section still says what it has to say, it just never moves.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let target = 0;
    let current = 0;
    let duration = 0;
    let shown = -1;

    const readDuration = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
    };

    const measure = () => {
      const box = wrap.getBoundingClientRect();
      // How far through the pinned run we are: 0 as the top locks, 1 as the
      // bottom releases.
      const travel = wrap.offsetHeight - window.innerHeight;
      const progress = travel > 0 ? Math.min(Math.max(-box.top / travel, 0), 1) : 0;
      target = progress;

      let next = 0;
      for (let i = 0; i < STAGES.length; i += 1) {
        if (progress >= STAGES[i].at) next = i;
      }
      if (next !== shown) {
        shown = next;
        setStage(next);
      }
    };

    const tick = () => {
      // Measured per frame rather than on `scroll`: Lenis drives the page from
      // its own loop, and reading the rect here keeps the two in step whatever
      // the scroll is coming from.
      measure();

      // Ease toward the scroll position rather than snapping to it. Seeks that
      // land within a frame are dropped — decoding every one of them is what
      // makes scrubbed video stutter.
      current += (target - current) * 0.12;
      // Metadata can land before this effect ever runs when the file is cached,
      // in which case the event never fires — so keep asking until it answers.
      if (duration <= 0) readDuration();
      if (duration > 0) {
        const t = current * duration;
        if (Math.abs(video.currentTime - t) > 1 / 24) video.currentTime = t;
      }
      raf = window.requestAnimationFrame(tick);
    };

    readDuration();
    video.addEventListener("loadedmetadata", readDuration);
    measure();

    // The file is 1.8MB and sits several screens down. Attaching the source
    // only once it is within a screen of the viewport keeps it out of the
    // initial page load, where it was most of the weight.
    const attach = () => {
      if (video.getAttribute("src")) return;
      video.setAttribute("src", "/video/pickle-process.mp4");
      video.load();
    };

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        attach();
        loader.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    loader.observe(wrap);

    // Last resort. If the observer never fires, the film still arrives for
    // anyone who has scrolled anywhere near it rather than staying a poster.
    const failsafe = window.setTimeout(() => {
      if (wrap.getBoundingClientRect().top < window.innerHeight * 2) attach();
    }, 4000);

    // The loop only runs while the film is on screen. Off screen there is
    // nothing to seek, and a rAF running the length of the page is rent paid
    // for nothing.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        raf = window.requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(wrap);

    return () => {
      window.clearTimeout(failsafe);
      loader.disconnect();
      io.disconnect();
      window.cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", readDuration);
    };
  }, []);

  return (
    <section aria-label="How the pickle is made">
      <div ref={wrapRef} className="relative h-[320vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--color-canvas)]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster="/video/pickle-process-poster.jpg"
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--color-canvas)] via-[color-mix(in_oklab,var(--color-canvas)_72%,transparent)] to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-14">
            <div className="u-shell">
              <p className="u-eyebrow">In our kitchen</p>
              <div className="mt-2 flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-8">
                <p className="u-display text-[clamp(1.75rem,4.4vw,3.25rem)] leading-none">
                  {STAGES[stage].punch}
                </p>
                <p className="u-data text-[var(--ink-dim)] md:pb-1.5">
                  {STAGES[stage].note}
                </p>
              </div>

              <ol aria-hidden="true" className="mt-5 flex gap-1.5">
                {STAGES.map((s, i) => (
                  <li
                    key={s.punch}
                    className={cx(
                      "h-[3px] flex-1 rounded-full transition-colors duration-500",
                      i <= stage ? "bg-leaf-deep" : "bg-[var(--hairline)]",
                    )}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
