"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll-lock";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, wheelMultiplier: 0.9 });
    let frame = 0;

    // Anything opening a modal needs to be able to stop this, not just hide
    // the body's overflow. See scroll-lock.ts.
    registerLenis(lenis);

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      registerLenis(null);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
