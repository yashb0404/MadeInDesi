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
