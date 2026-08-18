"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { money, weight } from "@/lib/format";
import { ProductShot } from "./ProductShot";
import { AddToBag } from "./AddToBag";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <article className="u-tin group flex flex-col overflow-hidden">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden"
      >
        <ProductShot
          product={product}
          priority={priority}
          className="w-full h-full transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        />

        {/* Sits on the photograph, so it carries its own solid ground. */}
        {product.noAddedSugar && (
          <span
            className="absolute top-3 left-3 u-data px-2.5 py-1 rounded-full text-leaf-deep"
            style={{ background: "var(--color-canvas)" }}
          >
            No added sugar
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <Link
              href={`/product/${product.slug}`}
              className="u-display text-[1.35rem] hover:text-leaf-deep transition-colors"
            >
              {product.name}
            </Link>
            <span className="u-data text-leaf-deep shrink-0">{money(product.price)}</span>
          </div>
          {product.qualifier && (
            <p className="text-[0.8rem] mt-1 text-[var(--ink-faint)]">{product.qualifier}</p>
          )}
        </div>

        <p className="text-sm text-[var(--ink-dim)] leading-relaxed flex-1">{product.blurb}</p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="u-data text-[var(--ink-faint)]">
            {weight(product.weightGrams)}
            {product.pieces ? ` · ${product.pieces} pcs` : ""}
          </span>
          <AddToBag slug={product.slug} compact />
        </div>
      </div>
    </article>
  );
}
