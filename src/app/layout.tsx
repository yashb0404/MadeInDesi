import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CartDrawer } from "@/components/CartDrawer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/Footer";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // Replace with the live domain once it exists; resolves OG image URLs.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Made in Desi — hand-rolled nutrition balls & chips",
    template: "%s · Made in Desi",
  },
  description:
    "Dates, nuts and seeds rolled by hand in small batches. Nutrition balls, biotin bites, calcium and iron balls, and jaggery banana chips.",
  keywords: [
    "handmade nutrition balls",
    "date and nut ladoo",
    "Andhra pickles online",
    "no refined sugar snacks",
    "healthy snacks Hyderabad",
  ],
  // Every page resolves its canonical against metadataBase, so the same page
  // reached with tracking parameters is not indexed as a second copy.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Made in Desi",
    locale: "en_IN",
    title: "Made in Desi — hand-rolled nutrition balls & chips",
    description:
      "Dates, nuts and seeds rolled by hand in small batches, in Hyderabad. No refined sugar, no preservatives.",
    // The real file is a 931x1600 phone portrait. Declaring a square it is not
    // makes Facebook and LinkedIn lay the card out against the wrong box.
    // WORTH DOING BEFORE LAUNCH: a purpose-made 1200x630 landscape card —
    // `summary_large_image` is a wide slot, and a portrait gets centre-cropped
    // to a stripe of it whatever the numbers here say.
    images: [{ url: "/products/nutrition-balls.jpg", width: 931, height: 1600, alt: "Hand-rolled nutrition balls" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Made in Desi — hand-rolled nutrition balls & chips",
    description:
      "Dates, nuts and seeds rolled by hand in small batches, in Hyderabad. No refined sugar, no preservatives.",
    images: ["/products/nutrition-balls.jpg"],
  },
  robots: { index: true, follow: true },
};

/**
 * Who this is, in the form search engines read rather than guess.
 *
 * Kept minimal and TRUE: only facts the client has confirmed. An address or a
 * phone number invented to fill the schema is worse than leaving it out —
 * Google cross-checks these against other listings.
 */
const ORGANISATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Made in Desi",
  description: "Hand-rolled nutrition balls, bites and Andhra pickles, made in small batches in Hyderabad.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/logo.png`,
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${instrument.variable} ${martian.variable}`}
    >
      <head>
        {/*
          Without scripting there is nothing to trigger the reveals, so turn
          them off entirely and show the page as-is. This is a stylesheet rather
          than a script because mutating <html> before hydration desynchronises
          React's class list.
        */}
        <noscript>
          <style>{`.u-reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <script
          type="application/ld+json"
          // The payload is our own constant, not user input, so there is
          // nothing here for a script tag to break out of.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION) }}
        />
      </head>
      <body>
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
