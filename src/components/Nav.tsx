"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart, useCartHydrated, totals } from "@/store/cart";
import { cx } from "@/lib/format";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/#kitchen", label: "The kitchen" },
  { href: "/#who", label: "Who it's for" },
];

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.openCart);
  const hydrated = useCartHydrated();
  const count = hydrated ? totals(lines).count : 0;

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cx(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-500",
        lifted && "bg-[color-mix(in_oklab,var(--color-canvas)_88%,transparent)] backdrop-blur-md",
      )}
      style={lifted ? { borderBottom: "1px solid var(--hairline)" } : undefined}
    >
      <div className="u-shell flex items-center justify-between h-[72px] gap-6">
        {/*
          The lockup without its tagline — "We bring you HEALTH, not just food"
          is unreadable at this height and would only muddy the bar. The name
          stays in the alt text, so the link still reads as the brand to a
          screen reader and to Google.
        */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-mark.png"
            alt="Made in Desi"
            width={856}
            height={687}
            priority
            className="h-11 w-auto md:h-12"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="u-data uppercase tracking-[0.18em] text-[var(--ink-dim)] hover:text-leaf-deep transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/*
          The bag needs to read as a control on its own — it has no label text
          to underline, so it carries a visible pill outline and fills in on
          hover rather than only shifting colour.
        */}
        <button
          type="button"
          onClick={openCart}
          className="group flex items-center gap-2.5 u-data uppercase tracking-[0.16em] cursor-pointer rounded-full px-4 py-2 text-ink border border-[var(--hairline)] transition-colors duration-300 hover:bg-leaf hover:text-canvas hover:border-leaf"
          aria-label={
            count > 0 ? `Open bag, ${count} ${count === 1 ? "item" : "items"}` : "Open bag"
          }
        >
          <ShoppingBag size={17} strokeWidth={1.6} aria-hidden />
          <span className="tabular-nums">{count}</span>
        </button>
      </div>
    </header>
  );
}
