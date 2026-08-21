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
  const src = detail && product.detailImage ? product.detailImage : product.image;

  // `failed` is keyed to the source. Without this, a frame that has already
  // fallen back stays fallen back when it is handed a different photograph.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  /*
    Two ways to end up on the placeholder. `photoPending` is the catalogue
    saying up front that no file shipped for this one — honouring it here means
    those products go straight to the placeholder instead of firing a request
    that is guaranteed to 400 and then flashing over to it. `failedSrc` is the
    unplanned case: a path that should have resolved and did not.
  */
  if (product.photoPending || failedSrc === src) {
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
        onError={() => setFailedSrc(src)}
        className="object-cover"
      />
    </div>
  );
}
