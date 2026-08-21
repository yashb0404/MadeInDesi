"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/store/cart";
import { cx } from "@/lib/format";

/**
 * The label changes to confirm the action, then settles back. Same verb
 * throughout: you add to the bag, and the bag is what opens.
 */
export function AddToBag({
  slug,
  compact = false,
  className,
}: {
  slug: string;
  compact?: boolean;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // The label settles back on a timer, and the bag is often what unmounts the
  // button (a card leaving a filtered grid). Cleared so the timer does not
  // outlive it, and restarted rather than stacked on a second click.
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type="button"
      onClick={() => {
        add(slug);
        setJustAdded(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setJustAdded(false), 1600);
      }}
      className={cx("u-btn", compact && "u-btn--ghost px-4 py-2", className)}
    >
      {justAdded ? "Added" : "Add to bag"}
    </button>
  );
}
