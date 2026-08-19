import { PRODUCTS } from "@/lib/products";
import { shippingFor } from "@/lib/format";

/**
 * Server-side pricing.
 *
 * The one rule this file exists to enforce: the browser sends slugs and
 * quantities, never money. Anyone can open devtools and change a number, so
 * every rupee charged is computed here from the catalogue instead. The cart's
 * `totals()` does the same arithmetic for display, but it runs on the client
 * and is therefore evidence of nothing.
 */

export type QuoteLine = { slug: string; qty: number };

export type Quote = {
  lines: { slug: string; name: string; qty: number; unitPrice: number; lineTotal: number }[];
  subtotal: number;
  shipping: number;
  /** Rupees. Multiply by 100 at the Razorpay boundary, not before. */
  total: number;
};

/** Narrows unknown JSON to cart lines. Anything malformed is dropped. */
export function parseLines(input: unknown): QuoteLine[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  return input.flatMap((raw) => {
    if (typeof raw !== "object" || raw === null) return [];
    const { slug, qty } = raw as Record<string, unknown>;
    if (typeof slug !== "string" || seen.has(slug)) return [];
    // Quantities are clamped to the same 1–99 the cart allows, so a tampered
    // payload cannot order 10,000 jars or a negative one.
    const n = typeof qty === "number" ? Math.floor(qty) : 0;
    if (!Number.isFinite(n) || n < 1) return [];
    seen.add(slug);
    return [{ slug, qty: Math.min(n, 99) }];
  });
}

export function quote(lines: QuoteLine[]): Quote {
  const priced = lines.flatMap((l) => {
    const product = PRODUCTS.find((p) => p.slug === l.slug);
    if (!product) return [];
    return [
      {
        slug: product.slug,
        name: product.name,
        qty: l.qty,
        unitPrice: product.price,
        lineTotal: product.price * l.qty,
      },
    ];
  });

  const subtotal = priced.reduce((n, l) => n + l.lineTotal, 0);
  const shipping = shippingFor(subtotal);
  return { lines: priced, subtotal, shipping, total: subtotal + shipping };
}

/** Razorpay counts in paise, as integers. ₹450 is 45000. */
export function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
