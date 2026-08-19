/**
 * The Razorpay boundary. Server only — importing this from a client component
 * would leak the secret into the bundle.
 *
 * Razorpay's REST API is small enough that the official SDK would be a
 * dependency for two fetch calls, so this talks to it directly. Keeping the
 * provider behind these functions also means switching to Cashfree or PhonePe
 * later is a change here rather than a change in the checkout.
 */

import crypto from "node:crypto";

const API = "https://api.razorpay.com/v1";

export type RazorpayCredentials = { keyId: string; keySecret: string; webhookSecret: string };

/**
 * Reads credentials at call time rather than module load, so a missing key is a
 * clear 500 on the checkout route instead of a build that fails to boot.
 */
export function credentials(): RazorpayCredentials | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!keyId || !keySecret || !webhookSecret) return null;
  return { keyId, keySecret, webhookSecret };
}

export type RazorpayOrder = { id: string; amount: number; currency: string; status: string };

/**
 * Registers the intended amount with Razorpay before the customer sees a
 * payment screen. The checkout modal reads the amount off this order, so what
 * the customer is asked to pay is fixed here, on the server, and the browser
 * gets no say in it.
 */
export async function createOrder(
  creds: RazorpayCredentials,
  amountPaise: number,
  receipt: string,
  notes: Record<string, string>,
): Promise<RazorpayOrder> {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay order failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as RazorpayOrder;
}

/**
 * Verifies a webhook actually came from Razorpay.
 *
 * The signature is an HMAC of the RAW request body — parsing and re-serialising
 * the JSON first will change the bytes and the check will fail even on genuine
 * requests. `timingSafeEqual` rather than `===` so the comparison does not leak
 * the expected digest one byte at a time.
 */
export function verifyWebhook(rawBody: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
