import type { Metadata } from "next";
import { CheckoutFlow } from "./CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="pt-32 pb-28">
      <div className="u-shell">
        <CheckoutFlow />
      </div>
    </div>
  );
}
