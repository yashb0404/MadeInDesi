import type { MetadataRoute } from "next";

/**
 * Crawlers are welcome everywhere except the two paths that are steps in a
 * transaction rather than pages: the checkout, and the payment endpoints.
 */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/checkout", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
