import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, related, PRODUCTS, NEEDS } from "@/lib/products";
import { money, weight } from "@/lib/format";
import { ProductShot } from "@/components/ProductShot";
import { ProductCard } from "@/components/ProductCard";
import { AddToBag } from "@/components/AddToBag";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Not found" };

  return {
    title: product.name,
    description: product.blurb,
    openGraph: { title: product.name, description: product.blurb, images: [product.image] },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const also = related(product.slug);

  return (
    <div className="pt-28 pb-24">
      <div className="u-shell">
        <Link
          href="/shop"
          className="u-data uppercase tracking-[0.16em] text-[var(--ink-dim)] hover:text-leaf-deep transition-colors"
        >
          ← The shelf
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 mt-8">
          {/* ---- imagery ------------------------------------------- */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[2px]" style={{ border: "1px solid var(--hairline)" }}>
              <ProductShot
                product={product}
                priority
                className="w-full aspect-[4/5]"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>

            {product.detailImage && (
              <div
                className="overflow-hidden rounded-[2px]"
                style={{ border: "1px solid var(--hairline)" }}
              >
                <ProductShot
                  product={product}
                  detail
                  className="w-full aspect-[4/3]"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            )}

            {/*
              A drag-to-turn 3D model used to sit here. It was a sphere wrapped
              in a crop of the photograph above it, and it never held up at this
              size — the crop tiled into a kaleidoscope, and a single stretched
              copy smeared at the silhouette. The code has been deleted rather
              than left dormant. A genuine 360 needs a turntable capture of the
              real product, not a better shader.
            */}
          </div>

          {/* ---- the pitch ----------------------------------------- */}
          <div className="lg:pt-2">
            <p className="u-eyebrow">
              {product.category === "chips" ? "Chips" : "Bites & balls"}
            </p>

            <h1 className="u-display text-[clamp(2.25rem,6vw,4rem)] mt-4">{product.name}</h1>
            {product.qualifier && (
              <p className="text-[var(--ink-dim)] mt-2 text-lg">{product.qualifier}</p>
            )}

            <div className="flex items-baseline gap-4 mt-7">
              <span className="u-display text-3xl text-leaf-deep">{money(product.price)}</span>
              <span className="u-data text-[var(--ink-faint)]">
                {weight(product.weightGrams)}
                {product.pieces ? ` · ${product.pieces} pieces` : ""}
              </span>
            </div>

            <p className="mt-7 text-[var(--ink-dim)] leading-relaxed max-w-[52ch]">
              {product.story}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {product.needs.map((n) => (
                <span
                  key={n}
                  className="u-data px-3 py-1.5 text-[var(--ink-dim)]"
                  style={{ border: "1px solid var(--hairline)" }}
                >
                  {NEEDS.find((x) => x.id === n)?.label}
                </span>
              ))}
              {product.noAddedSugar && (
                <span
                  className="u-data px-3 py-1.5 text-leaf-deep"
                  style={{ border: "1px solid color-mix(in oklab, var(--color-leaf) 40%, transparent)" }}
                >
                  No added sugar
                </span>
              )}
            </div>

            <AddToBag slug={product.slug} className="mt-9 w-full sm:w-auto sm:min-w-[16rem]" />

            {/* ---- what's in it ------------------------------------ */}
            <div className="mt-14">
              <p className="u-eyebrow mb-4">Ingredients</p>
              <p className="text-[var(--ink-dim)] leading-relaxed">
                {product.ingredients.join(", ")}.
              </p>
            </div>

            <dl className="mt-10 grid gap-px" style={{ background: "var(--hairline)" }}>
              {[
                ["Net weight", weight(product.weightGrams)],
                ["Best within", `${product.shelfLifeDays} days of dispatch`],
                ["Store", "Airtight, cool, out of the sun"],
                ["Allergens", "Tree nuts, sesame. Made in a kitchen that handles all nuts."],
              ].map(([k, v]) => (
                <div key={k} className="bg-canvas py-4 flex items-baseline justify-between gap-8">
                  <dt className="u-eyebrow shrink-0">{k}</dt>
                  <dd className="text-right text-sm text-[var(--ink-dim)] max-w-[32ch]">{v}</dd>
                </div>
              ))}
            </dl>

            {product.nutrition.length > 0 && (
              <div className="mt-10">
                <p className="u-eyebrow mb-4">Per 100 g</p>
                <dl className="grid gap-px" style={{ background: "var(--hairline)" }}>
                  {product.nutrition.map((row) => (
                    <div
                      key={row.label}
                      className="bg-canvas py-3 flex items-baseline justify-between gap-8"
                    >
                      <dt className="text-sm text-[var(--ink-dim)]">{row.label}</dt>
                      <dd className="u-data">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="u-shell mt-28 md:mt-36">
        <Reveal>
          <h2 className="u-display text-[clamp(1.75rem,4vw,2.75rem)] mb-10">Goes with</h2>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {also.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
