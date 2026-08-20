import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

/**
 * The sitemap. Built from the catalogue, so a new product is listed the moment
 * it is added rather than whenever someone remembers to update a list.
 *
 * Checkout is deliberately absent — it is a step in a flow, not a page anyone
 * should arrive at from a search result.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...PRODUCTS.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
