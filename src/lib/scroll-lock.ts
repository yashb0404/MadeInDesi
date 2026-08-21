"use client";

import type Lenis from "lenis";

/**
 * Freezing the page while something is open on top of it.
 *
 * `document.body.style.overflow = "hidden"` is the usual move and it is not
 * enough here. It stops NATIVE scrolling, but Lenis does not scroll natively —
 * it swallows the wheel event and calls `window.scrollTo()` itself, and a
 * viewport with `overflow: hidden` still honours a programmatic scroll. So the
 * page carries on sliding behind the drawer, which is the one thing the lock
 * exists to prevent.
 *
 * Both halves are therefore needed: the overflow for anything native (a
 * trackpad fling that Lenis has not claimed, a keyboard PageDown), and
 * `lenis.stop()` for Lenis itself.
 */

let instance: Lenis | null = null;

/** Called by SmoothScroll. Null on teardown, and never set at all when the
 *  reader asked for reduced motion — in which case scrolling is native and the
 *  overflow alone is the whole lock. */
export function registerLenis(lenis: Lenis | null): void {
  instance = lenis;
}

/** Locks scrolling and returns the undo, so a caller can hand it straight back
 *  as an effect cleanup. Restores the previous overflow rather than assuming it
 *  was empty. */
export function lockScroll(): () => void {
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  instance?.stop();

  return () => {
    document.body.style.overflow = previous;
    instance?.start();
  };
}
