import Link from "next/link";
import { HandHeart } from "lucide-react";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="u-band u-band--open-end pt-16 md:pt-20 pb-12">
      <div className="u-shell grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          {/*
            The hands-into-a-heart from the logo, used once and small. It sits
            with the line about making what we'd give our own families, which is
            the sentence it belongs to.
          */}
          <div className="flex items-center gap-3">
            <p className="u-display text-3xl">Made in Desi</p>
            <HandHeart
              size={22}
              strokeWidth={1.5}
              className="text-turmeric shrink-0"
              aria-hidden
            />
          </div>
          <p className="text-sm text-[var(--ink-dim)] mt-4 max-w-[38ch] leading-relaxed">
            Rolled by hand in small batches, in Hyderabad. We make what we would give our own
            families, which is why the boxes are small and the list is short.
          </p>
        </div>

        <div>
          <p className="u-eyebrow mb-4">Shop</p>
          <ul className="space-y-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop?category=${c.id}`}
                  className="text-sm text-[var(--ink-dim)] hover:text-leaf-deep transition-colors"
                >
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/shop"
                className="text-sm text-[var(--ink-dim)] hover:text-leaf-deep transition-colors"
              >
                Everything
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="u-eyebrow mb-4">Reach us</p>
          <ul className="space-y-2.5 text-sm text-[var(--ink-dim)]">
            <li>
              <a href="mailto:info@madeindesi.org" className="hover:text-leaf-deep transition-colors">
                info@madeindesi.org
              </a>
            </li>
            <li>
              <a href="tel:+919652470354" className="hover:text-leaf-deep transition-colors">
                +91 96524 70354
              </a>
            </li>
            <li className="pt-1 u-data text-[var(--ink-faint)] leading-relaxed">
              Orders ship Mon–Fri.
              <br />
              Hyderabad next day, rest of India 2–4 days.
            </li>
          </ul>
        </div>
      </div>

      <div className="u-shell mt-16 pt-6 u-rule flex flex-wrap gap-x-6 gap-y-2 justify-between u-data text-[var(--ink-faint)]">
        <span>© {new Date().getFullYear()} Made in Desi</span>
        <span>FSSAI licence no. — pending</span>
      </div>
    </footer>
  );
}
