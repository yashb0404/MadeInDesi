"use client";

import Link from "next/link";
import { useState } from "react";
import { openRazorpay } from "@/lib/razorpay-checkout";
import { useCart, useCartHydrated, totals } from "@/store/cart";
import { money, weight, FREE_SHIPPING_OVER } from "@/lib/format";
import { ProductShot } from "@/components/ProductShot";

type Details = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY: Details = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

type Field = {
  key: keyof Details;
  label: string;
  /** Written out rather than derived from the label, so acronyms survive. */
  missing: string;
  type?: string;
  span?: boolean;
  hint?: string;
};

/*
  Paired two-up wherever the pair is short. Name and address take a full row
  each; everything else fits half. No email — the order is confirmed on the
  phone number, so asking for one is a field nobody needs to fill.
*/
const FIELDS: Field[] = [
  { key: "name", label: "Full name", missing: "Add your name.", span: true },
  { key: "phone", label: "Phone", missing: "Add a phone number.", type: "tel" },
  { key: "pincode", label: "PIN code", missing: "Add your PIN code." },
  { key: "address", label: "Address", missing: "Add your street address.", span: true },
  { key: "city", label: "City", missing: "Add your city." },
  { key: "state", label: "State", missing: "Add your state." },
];

/* Lets the browser fill the whole address in one tap. */
const AUTOCOMPLETE: Record<keyof Details, string> = {
  name: "name",
  phone: "tel",
  address: "street-address",
  city: "address-level2",
  state: "address-level1",
  pincode: "postal-code",
};

export function CheckoutFlow() {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const hydrated = useCartHydrated();

  const [details, setDetails] = useState<Details>(EMPTY);
  const [touched, setTouched] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { detailed, subtotal, shipping, total } = totals(hydrated ? lines : []);

  const missing = FIELDS.filter((f) => !details[f.key].trim()).map((f) => f.key);
  const pincodeBad = details.pincode.trim().length > 0 && !/^\d{6}$/.test(details.pincode.trim());
  const canPlace = missing.length === 0 && !pincodeBad && detailed.length > 0;

  /**
   * Checkout.
   *
   * Sends slugs and quantities — never a total. The server prices the bag
   * itself and registers that amount with Razorpay, so the number the customer
   * is asked to pay cannot be edited from this page.
   *
   * The confirmation shown at the end says the payment went through, which is
   * true, but it is NOT what marks the order paid: the webhook does that, on
   * its own, whether or not this tab is still open.
   */
  async function placeOrder() {
    setTouched(true);
    setError(null);
    if (!canPlace || busy) return;

    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
          customer: details,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not start the payment.");

      await openRazorpay({
        keyId: data.keyId,
        orderId: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: details.name,
        phone: details.phone,
        ref: data.ref,
        onSuccess: () => {
          setPlaced(data.ref);
          clear();
        },
        // Dismissing the modal is not a failure — people go and open their UPI
        // app, or change their mind. The bag is left exactly as it was.
        onDismiss: () => setBusy(false),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (placed) {
    return (
      <div className="max-w-[46ch]">
        <p className="u-eyebrow">Order placed</p>
        <h1 className="u-display text-[clamp(2.25rem,6vw,4rem)] mt-4">
          That&rsquo;s in. Reference {placed}.
        </h1>
        <p className="mt-6 text-[var(--ink-dim)] leading-relaxed">
          Payment received. We roll on Monday and Thursday, so your box goes out on whichever comes
          first. You&rsquo;ll get a message on {details.phone || "your phone"} when it ships.
        </p>
        <Link href="/shop" className="u-btn mt-9">
          Back to the shelf
        </Link>
      </div>
    );
  }

  if (hydrated && detailed.length === 0) {
    return (
      <div className="max-w-[46ch]">
        <h1 className="u-display text-[clamp(2.25rem,6vw,4rem)]">Your bag is empty.</h1>
        <p className="mt-6 text-[var(--ink-dim)]">
          Nothing to check out yet. The shelf is short — it won&rsquo;t take long.
        </p>
        <Link href="/shop" className="u-btn mt-8">
          Shop the shelf
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
      {/* ---- details ------------------------------------------------- */}
      <div>
        <p className="u-eyebrow">Checkout</p>
        <h1 className="u-display text-[clamp(1.75rem,4vw,2.75rem)] mt-3">Sweet home</h1>

        <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2 mt-8">
          {FIELDS.map((f) => {
            const invalid =
              touched && (missing.includes(f.key) || (f.key === "pincode" && pincodeBad));
            return (
              <div key={f.key} className={f.span ? "sm:col-span-2" : undefined}>
                <label className="u-label" htmlFor={f.key}>
                  {f.label}
                </label>
                <input
                  id={f.key}
                  name={f.key}
                  type={f.type ?? "text"}
                  autoComplete={AUTOCOMPLETE[f.key]}
                  inputMode={f.key === "pincode" ? "numeric" : undefined}
                  className="u-field py-2.5"
                  value={details[f.key]}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? `${f.key}-error` : undefined}
                  style={invalid ? { borderColor: "var(--color-berry)" } : undefined}
                  onChange={(e) => setDetails((d) => ({ ...d, [f.key]: e.target.value }))}
                />
                {invalid ? (
                  <p id={`${f.key}-error`} className="u-data text-berry mt-1.5">
                    {f.key === "pincode" && pincodeBad ? "A PIN code is six digits." : f.missing}
                  </p>
                ) : f.hint ? (
                  <p className="u-data text-[var(--ink-faint)] mt-1.5">{f.hint}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- summary ------------------------------------------------- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="u-tin p-6">
          <p className="u-eyebrow mb-5">Your order</p>

          <div className="space-y-4">
            {detailed.map(({ product, qty, lineTotal }) => (
              <div key={product.slug} className="flex gap-4 items-center">
                <div
                  className="shrink-0 w-14 h-14 overflow-hidden rounded-[2px]"
                  style={{ border: "1px solid var(--hairline)" }}
                >
                  <ProductShot product={product} className="w-full h-full" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{product.name}</p>
                  <p className="u-data text-[var(--ink-faint)] mt-0.5">
                    {qty} × {weight(product.weightGrams)}
                  </p>
                </div>
                <span className="u-data text-leaf-deep">{money(lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 u-rule space-y-2.5">
            <div className="flex justify-between u-data">
              <span className="text-[var(--ink-dim)]">Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between u-data">
              <span className="text-[var(--ink-dim)]">
                Shipping {subtotal >= FREE_SHIPPING_OVER && "(over ₹999)"}
              </span>
              <span>{shipping === 0 ? "Free" : money(shipping)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 mt-3 u-rule">
              <span className="u-eyebrow">Total</span>
              <span className="u-display text-2xl text-leaf-deep">{money(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={placeOrder}
            disabled={busy}
            aria-busy={busy}
            className="u-btn w-full mt-7 disabled:opacity-60"
          >
            {busy ? "Opening payment…" : `Pay ${money(total)}`}
          </button>

          {error ? (
            <p role="alert" className="u-data text-berry mt-4 leading-relaxed">
              {error}
            </p>
          ) : null}

          <p className="u-data text-[var(--ink-faint)] mt-4 leading-relaxed">
            UPI or card. Payments are handled by Razorpay &mdash; card details are entered on their
            secure window and never touch this site.
          </p>
        </div>
      </div>
    </div>
  );
}
