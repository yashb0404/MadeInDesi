"use client";

/**
 * The browser half: loads Razorpay's checkout script and opens the modal.
 *
 * Kept out of the checkout component because it is all imperative script
 * loading and third-party globals, and because nothing decided in here is
 * trusted — the modal is a way to collect a payment, not a source of truth
 * about one. See the webhook route for the part that counts.
 */

const SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayInstance = { open: () => void };
type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/**
 * Loaded on demand rather than in the page head: it is a third-party script
 * that only matters once somebody actually checks out, so it stays off every
 * other page. The promise is cached so a second click does not add a second
 * script tag.
 */
let loading: Promise<RazorpayConstructor> | null = null;

function loadCheckout(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (loading) return loading;

  loading = new Promise<RazorpayConstructor>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () =>
      window.Razorpay
        ? resolve(window.Razorpay)
        : reject(new Error("Razorpay loaded but did not initialise."));
    script.onerror = () => {
      // Let a later attempt retry — this fails on flaky connections and on
      // blockers, and one failure should not disable checkout for the session.
      loading = null;
      reject(new Error("Could not reach the payment window. Check your connection."));
    };
    document.head.appendChild(script);
  });

  return loading;
}

export type OpenOptions = {
  keyId: string;
  orderId: string;
  /** Paise, straight from the server. Displayed only; the order fixes the charge. */
  amount: number;
  currency: string;
  name: string;
  phone: string;
  ref: string;
  onSuccess: () => void;
  onDismiss: () => void;
};

export async function openRazorpay(o: OpenOptions): Promise<void> {
  const Razorpay = await loadCheckout();

  const rzp = new Razorpay({
    key: o.keyId,
    order_id: o.orderId,
    amount: o.amount,
    currency: o.currency,
    name: "Made in Desi",
    description: `Order ${o.ref}`,
    // UPI and cards only. Netbanking and wallets add tabs most customers scroll
    // past, and EMI on a jar of pickle is noise.
    method: {
      upi: true,
      card: true,
      netbanking: false,
      wallet: false,
      emi: false,
      paylater: false,
    },
    prefill: { name: o.name, contact: o.phone },
    notes: { ref: o.ref },
    theme: { color: "#2c4c36" },
    // Fires when the customer closes the modal without paying. Not an error.
    modal: { ondismiss: o.onDismiss, confirm_close: true },
    handler: o.onSuccess,
  });

  rzp.open();
}
