import type { Metadata } from "next";
import { ShopGrid } from "./ShopGrid";
import { CATEGORIES, type Category } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Nutrition balls, biotin bites, calcium and iron balls, mixed berry and nuts, and jaggery banana chips. Rolled by hand in small batches.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage(props: PageProps<"/shop">) {
  const { category } = await props.searchParams;
  const first = Array.isArray(category) ? category[0] : category;
  const initial = CATEGORIES.find((c) => c.id === first)?.id as Category | undefined;

  return (
    <div className="pt-24 pb-20">
      {/*
        The header sits on one line rather than stacking: on a shop page the
        filters and the grid are what people came for, so the title takes the
        left and the standfirst rides alongside it instead of pushing the
        controls below the fold.
      */}
      <div className="u-shell flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <div>
          <p className="u-eyebrow">The shelf</p>
          <h1 className="u-display text-[clamp(1.9rem,4vw,3.25rem)] mt-3 max-w-[18ch]">
            Everything we make, which is not very much.
          </h1>
        </div>
        <p className="max-w-[34ch] text-sm text-[var(--ink-dim)] leading-relaxed">
          Five things, made properly, rolled twice a week. Filter by what it is, or by who it is
          for.
        </p>
      </div>

      <div className="u-shell mt-10">
        <ShopGrid initialCategory={initial} />
      </div>
    </div>
  );
}
