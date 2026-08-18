"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * A trail of product cut-outs that follows the cursor across the hero.
 *
 * Built to stay off the main thread:
 *
 * - The pool is fixed. Twelve elements are rendered once and recycled forever,
 *   so a fast cursor never allocates a node or triggers a style recalc beyond
 *   the one element it touches.
 * - Only `transform` and `opacity` are animated. Both are composited, so the
 *   browser skips layout and paint entirely.
 * - Spawning is throttled by DISTANCE, not time. `mousemove` fires far more
 *   often than the effect needs; one drop per 110px travelled is the whole
 *   budget.
 * - The images are requested at 128px through the Next optimiser rather than
 *   at their native 512px, so the twelve of them cost very little to decode.
 *
 * It is skipped entirely for coarse pointers (there is no cursor to follow on a
 * phone) and for anyone who asked for reduced motion.
 */

const SOURCES = [
  "/cutouts/nutrition-balls.jpg",
  "/cutouts/biotin-bites.jpg",
  "/cutouts/mixed-berry-nuts.jpg",
  "/cutouts/calcium-iron-balls.jpg",
];

/** Enough that a fast sweep never runs out and reuses a still-visible drop. */
const POOL = 12;
const SIZE = 128;
/** Pixels of cursor travel between drops. */
const STEP = 110;

export function CursorTrail({
  /**
   * Multiplies the whole trail. Each drop still fades from 1 to 0 on its own —
   * this just sets the ceiling, for sections where the trail should sit further
   * back behind the type.
   */
  opacity = 1,
}: {
  opacity?: number;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    const section = el.parentElement;
    if (!section) return;

    const drops = Array.from(el.children) as HTMLElement[];
    let next = 0;
    let lastX = 0;
    let lastY = 0;
    let primed = false;

    function drop(x: number, y: number) {
      const node = drops[next];
      next = (next + 1) % drops.length;

      const tilt = (next % 2 ? 1 : -1) * (4 + (next % 3) * 3);
      const at = `translate3d(${Math.round(x - SIZE / 2)}px, ${Math.round(y - SIZE / 2)}px, 0)`;

      // Place and show with no transition...
      node.style.transition = "none";
      node.style.transform = `${at} scale(1) rotate(${tilt}deg)`;
      node.style.opacity = "1";

      // ...then force the style to land before animating away from it.
      void node.offsetWidth;

      node.style.transition =
        "transform 900ms var(--ease-out-soft), opacity 900ms var(--ease-out-soft)";
      node.style.opacity = "0";
      node.style.transform = `${at} scale(0.76) rotate(${tilt * 1.6}deg)`;
    }

    function onMove(e: MouseEvent) {
      const box = section!.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;

      if (!primed) {
        primed = true;
        lastX = x;
        lastY = y;
        return;
      }

      if (Math.hypot(x - lastX, y - lastY) < STEP) return;
      lastX = x;
      lastY = y;
      drop(x, y);
    }

    function onLeave() {
      primed = false;
    }

    section.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ opacity }}
    >
      {Array.from({ length: POOL }, (_, i) => (
        <div
          key={i}
          className="absolute top-0 left-0 rounded-full overflow-hidden will-change-transform"
          style={{
            width: SIZE,
            height: SIZE,
            opacity: 0,
            boxShadow: "var(--lift)",
          }}
        >
          <Image
            src={SOURCES[i % SOURCES.length]}
            alt=""
            width={SIZE}
            height={SIZE}
            quality={70}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
