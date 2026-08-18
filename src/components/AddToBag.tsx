"use client";

import { useState } from "react";
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

  return (
    <button
      type="button"
      onClick={() => {
        add(slug);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1600);
      }}
      className={cx("u-btn", compact && "u-btn--ghost px-4 py-2", className)}
    >
      {justAdded ? "Added" : "Add to bag"}
    </button>
  );
}
