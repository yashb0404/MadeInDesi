"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { cx } from "@/lib/format";

/**
 * Product photography, with a designed fallback rather than a broken image.
 *
 * `className` sizes the frame; the photograph fills it and is cropped centrally.
 * The shots are tall phone portraits, so every frame on the site crops them —
 * that is intended, and it is why the subject sits centre in each one.
 */
export function ProductShot({
  product,
  className,
  sizes = "(min-width: 768px) 33vw, 100vw",
  priority = false,
  /** Use the close-up instead of the pack shot, where one exists. */
  detail = false,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
  detail?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = detail && product.detailImage ? product.detailImage : product.image;

  if (failed) {
    return (
      <div
        className={cx("relative flex items-center justify-center overflow-hidden bg-surface-2", className)}
        role="img"
        aria-label={`${product.name} — photograph pending`}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 42%, color-mix(in oklab, var(--color-leaf) 22%, transparent), transparent 70%)",
          }}
        />
        <span className="u-display relative text-center px-6 text-lg leading-snug text-[var(--ink-dim)]">
          {product.name}
        </span>
        <span className="u-data absolute bottom-3 left-0 right-0 text-center text-[var(--ink-faint)]">
          photo pending
        </span>
      </div>
    );
  }

  return (
    <div className={cx("relative overflow-hidden bg-surface-2", className)}>
      <Image
        src={src}
        alt={product.name}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </div>
  );
}
