"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Two blocks holding the same patch of screen: the first fades out as the
 * reader scrolls, the second arrives in its place, and the page carries on.
 *
 * Used where one passage produces the next — the realisation coming out of the
 * illness — so the swap is the argument rather than decoration. It also buys
 * back a screen of page, since both halves are shown in one viewport.
 *
 * Opacity and transform are written straight to the nodes from a rAF loop. No
 * state, so the page never re-renders while scrolling, and both halves stay in
 * the document the whole time for anyone reading it with something other than
 * their eyes.
 */
export function ScrollSwap({ first, second }: { first: ReactNode; second: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const a = firstRef.current;
    const b = secondRef.current;
    if (!wrap || !a || !b) return;

    // Reduced motion keeps both halves plainly visible and skips the swap.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      a.style.opacity = "1";
      b.style.opacity = "1";
      b.style.position = "relative";
      b.style.transform = "none";
      return;
    }

    let raf = 0;

    const clamp = (n: number) => Math.min(Math.max(n, 0), 1);

    const frame = () => {
      const travel = wrap.offsetHeight - window.innerHeight;
      const p = travel > 0 ? clamp(-wrap.getBoundingClientRect().top / travel) : 0;

      // The second starts arriving while the first is still going, so the
      // handoff never leaves an empty screen. Fading straight out and then in
      // reads as two slides; overlapping them reads as one thought becoming
      // another.
      const out = clamp(p / 0.5);
      const inn = clamp((p - 0.28) / 0.4);

      a.style.opacity = String(1 - out);
      a.style.transform = `translate3d(0, ${-out * 24}px, 0)`;
      b.style.opacity = String(inn);
      b.style.transform = `translate3d(0, ${(1 - inn) * 28}px, 0)`;

      raf = window.requestAnimationFrame(frame);
    };

    // Only runs while the pair is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        raf = window.requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(wrap);

    return () => {
      io.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[135vh]">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="relative w-full">
          <div ref={firstRef} className="will-change-[opacity,transform]">
            {first}
          </div>
          <div
            ref={secondRef}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0 will-change-[opacity,transform]"
          >
            {second}
          </div>
        </div>
      </div>
    </div>
  );
}
