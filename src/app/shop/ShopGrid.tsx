"use client";

import { useState } from "react";
import {
  PRODUCTS,
  NEEDS,
  CATEGORIES,
  photographedFirst,
  type Need,
  type Category,
} from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { cx } from "@/lib/format";

type Filter = { kind: "all" } | { kind: "category"; id: Category } | { kind: "need"; id: Need };

export function ShopGrid({ initialCategory }: { initialCategory?: Category }) {
  const [filter, setFilter] = useState<Filter>(
    initialCategory ? { kind: "category", id: initialCategory } : { kind: "all" },
  );

  const shown = PRODUCTS.filter((p) => {
    if (filter.kind === "all") return true;
    if (filter.kind === "category") return p.category === filter.id;
    return p.needs.includes(filter.id);
  }).sort(photographedFirst);

  const chip = (active: boolean) =>
    cx(
      "u-data uppercase px-4 py-2 rounded-full transition-colors duration-300 cursor-pointer",
      active ? "bg-leaf text-canvas" : "text-[var(--ink-dim)] hover:text-leaf-deep",
    );

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-10" style={{ minHeight: "2.5rem" }}>
        <button
          type="button"
          onClick={() => setFilter({ kind: "all" })}
          className={chip(filter.kind === "all")}
          style={filter.kind !== "all" ? { border: "1px solid var(--hairline)" } : undefined}
          aria-pressed={filter.kind === "all"}
        >
          Everything
        </button>

        {CATEGORIES.map((c) => {
          const active = filter.kind === "category" && filter.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter({ kind: "category", id: c.id })}
              className={chip(active)}
              style={!active ? { border: "1px solid var(--hairline)" } : undefined}
              aria-pressed={active}
            >
              {c.label}
            </button>
          );
        })}

        <span
          className="mx-1 h-5 w-px hidden sm:block"
          style={{ background: "var(--hairline)" }}
          aria-hidden
        />

        {NEEDS.map((n) => {
          const active = filter.kind === "need" && filter.id === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setFilter({ kind: "need", id: n.id })}
              className={chip(active)}
              style={!active ? { border: "1px solid var(--hairline)" } : undefined}
              aria-pressed={active}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      <p className="u-data text-[var(--ink-faint)] mb-6" aria-live="polite">
        {shown.length} of {PRODUCTS.length}
      </p>

      {shown.length === 0 ? (
        <p className="u-display text-2xl py-16">Nothing under that filter yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 3} />
          ))}
        </div>
      )}
    </>
  );
}
