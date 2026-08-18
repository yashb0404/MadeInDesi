"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart, useCartHydrated, totals } from "@/store/cart";
import { money, weight, FREE_SHIPPING_OVER } from "@/lib/format";
import { ProductShot } from "./ProductShot";

export function CartDrawer() {
  const { lines, open, closeCart, setQty } = useCart();
  const hydrated = useCartHydrated();
  const panel = useRef<HTMLDivElement>(null);
  const { detailed, subtotal, shipping, count } = totals(hydrated ? lines : []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeCart]);

  const away = FREE_SHIPPING_OVER - subtotal;

  return (
    <>
      {/* Tinted with the page ink rather than pure black, so it stays warm. */}
      <div
        onClick={closeCart}
        aria-hidden
        className="fixed inset-0 z-[70] backdrop-blur-sm transition-opacity duration-500"
        style={{
          background: "color-mix(in oklab, var(--color-ink) 55%, transparent)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        tabIndex={-1}
        inert={!open || undefined}
        className="fixed top-0 right-0 bottom-0 z-[71] w-full max-w-[26rem] bg-surface flex flex-col transition-transform duration-500 [transition-timing-function:var(--ease-out-soft)]"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          borderLeft: "1px solid var(--hairline)",
          boxShadow: "-24px 0 60px -30px color-mix(in oklab, var(--color-ink) 45%, transparent)",
        }}
      >
        <div className="flex items-center justify-between px-6 h-[72px] u-rule border-t-0 border-b">
          <span className="u-eyebrow">Your bag — {count}</span>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="grid place-items-center w-9 h-9 rounded-full cursor-pointer text-[var(--ink-dim)] hover:bg-surface-2 hover:text-leaf-deep transition-colors"
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>

        {detailed.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <span
              aria-hidden
              className="grid place-items-center w-16 h-16 rounded-full text-leaf-deep"
              style={{ background: "var(--color-surface-2)" }}
            >
              <ShoppingBag size={24} strokeWidth={1.4} />
            </span>
            <p className="u-display text-2xl">Nothing in the bag yet.</p>
            <p className="text-sm text-[var(--ink-dim)] max-w-[24ch]">
              Start with the Nutrition Balls if you are not sure.
            </p>
            <Link href="/shop" onClick={closeCart} className="u-btn u-btn--ghost mt-1">
              Browse the shelf
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto u-hide-scrollbar">
              {detailed.map(({ product, qty, lineTotal }) => (
                <div key={product.slug} className="flex gap-4 p-6 u-rule">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeCart}
                    className="shrink-0 w-20 h-20 overflow-hidden rounded-lg"
                    style={{ border: "1px solid var(--hairline)" }}
                  >
                    <ProductShot product={product} className="w-full h-full" sizes="80px" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="block font-medium leading-tight hover:text-leaf-deep transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="u-data text-[var(--ink-faint)] mt-1">
                      {weight(product.weightGrams)}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div
                        className="flex items-center rounded-full overflow-hidden"
                        style={{ border: "1px solid var(--hairline)" }}
                      >
                        <button
                          type="button"
                          onClick={() => setQty(product.slug, qty - 1)}
                          aria-label={`Reduce ${product.name}`}
                          className="grid place-items-center w-7 h-7 cursor-pointer text-[var(--ink-dim)] hover:bg-leaf hover:text-canvas transition-colors"
                        >
                          <Minus size={13} strokeWidth={1.8} />
                        </button>
                        <span className="u-data w-7 text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.slug, qty + 1)}
                          aria-label={`Add another ${product.name}`}
                          className="grid place-items-center w-7 h-7 cursor-pointer text-[var(--ink-dim)] hover:bg-leaf hover:text-canvas transition-colors"
                        >
                          <Plus size={13} strokeWidth={1.8} />
                        </button>
                      </div>

                      <span className="u-data text-leaf-deep">{money(lineTotal)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 u-rule border-b-0 space-y-4 bg-canvas">
              {/*
                The free-shipping threshold as a bar rather than a sentence —
                it shows how close you are, which the sentence alone never did.
              */}
              <div className="space-y-2">
                <div
                  className="h-1 w-full rounded-full overflow-hidden"
                  style={{ background: "var(--hairline)" }}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-700 [transition-timing-function:var(--ease-out-soft)]"
                    style={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_OVER) * 100)}%`,
                      background: away > 0 ? "var(--color-turmeric)" : "var(--color-leaf)",
                    }}
                  />
                </div>
                <p className="u-data text-[var(--ink-faint)]">
                  {away > 0 ? `${money(away)} more for free shipping` : "Free shipping unlocked"}
                </p>
              </div>

              <div className="flex justify-between u-data">
                <span className="text-[var(--ink-dim)]">Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between u-data">
                <span className="text-[var(--ink-dim)]">Shipping</span>
                <span>{shipping === 0 ? "Free" : money(shipping)}</span>
              </div>

              <Link href="/checkout" onClick={closeCart} className="u-btn w-full">
                Checkout — {money(subtotal + shipping)}
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
