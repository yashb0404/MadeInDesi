"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product } from "@/lib/products";
import { shippingFor } from "@/lib/format";

export type CartLine = { slug: string; qty: number };

type CartState = {
  lines: CartLine[];
  open: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,

      add: (slug, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.slug === slug);
          const lines = existing
            ? s.lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, 99) } : l))
            : [...s.lines, { slug, qty }];
          return { lines, open: true };
        }),

      setQty: (slug, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.slug !== slug)
              : s.lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 99) } : l)),
        })),

      remove: (slug) => set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
      openCart: () => set({ open: true }),
      closeCart: () => set({ open: false }),
    }),
    {
      name: "maaya-cart",
      partialize: (s) => ({ lines: s.lines }),
      // The server has no localStorage. Rehydrate from an effect instead, so the
      // first client render matches the server HTML and React does not warn.
      skipHydration: true,
    },
  ),
);

// Kick off the read as soon as this module reaches a browser. React still
// hydrates against the server's "not yet" answer below, then re-renders.
if (typeof window !== "undefined") {
  void useCart.persist.rehydrate();
}

/**
 * True once the persisted cart has been read back. Render cart counts and
 * totals only when this is true — before it, the store is legitimately empty,
 * and showing that empty state as though it were real makes the bag flicker.
 */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

/** Cart lines joined to catalogue data. Unknown slugs are dropped, not crashed on. */
export type DetailedLine = { product: Product; qty: number; lineTotal: number };

export function detailLines(lines: CartLine[]): DetailedLine[] {
  return lines.flatMap((l) => {
    const product = PRODUCTS.find((p) => p.slug === l.slug);
    if (!product) return [];
    return [{ product, qty: l.qty, lineTotal: product.price * l.qty }];
  });
}

export function totals(lines: CartLine[]) {
  const detailed = detailLines(lines);
  const subtotal = detailed.reduce((n, l) => n + l.lineTotal, 0);
  const shipping = shippingFor(subtotal);
  const count = detailed.reduce((n, l) => n + l.qty, 0);
  return { detailed, subtotal, shipping, total: subtotal + shipping, count };
}
