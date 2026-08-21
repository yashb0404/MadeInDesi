const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/**
 * RUPEES in, "₹450" out — not paise. Paise exist only at the Razorpay
 * boundary (`toPaise` in lib/quote.ts); nothing on the page is priced in them.
 */
export function money(rupees: number): string {
  return inr.format(rupees);
}

export function weight(grams: number): string {
  return grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`;
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Free shipping over this. Shown in the cart so it is never a surprise. */
export const FREE_SHIPPING_OVER = 999;
export const SHIPPING_FLAT = 79;

export function shippingFor(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
}
