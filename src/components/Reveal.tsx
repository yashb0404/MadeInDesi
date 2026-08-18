"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/lib/format";

/**
 * One IntersectionObserver per element, flipping a data attribute. The actual
 * transition lives in CSS (`.u-reveal`), so reduced-motion is handled in one
 * place and nothing animates from JS.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.dataset.shown = "true";
    };

    // Anything already on screen shows at once — no observer round-trip, so
    // above-the-fold content never waits.
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
      show();
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    // Last resort. If the observer never fires for any reason, the content
    // still arrives rather than staying invisible forever.
    const failsafe = window.setTimeout(show, 2500);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        show();
        window.clearTimeout(failsafe);
        io.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cx("u-reveal", className)}
      data-shown="false"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
