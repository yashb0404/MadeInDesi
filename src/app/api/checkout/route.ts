import { NextResponse } from "next/server";
import { parseLines, quote, toPaise } from "@/lib/quote";
import { createOrder, credentials } from "@/lib/razorpay";
import { newRef, saveOrder, type Customer } from "@/lib/orders";

/** node, not edge: the Razorpay call and the order store both need node APIs. */
export const runtime = "nodejs";

const REQUIRED: (keyof Customer)[] = ["name", "phone", "address", "city", "state", "pincode"];

/** The same rules the checkout form enforces, applied again where they count. */
function parseCustomer(input: unknown): Customer | null {
  if (typeof input !== "object" || input === null) return null;
  const raw = input as Record<string, unknown>;
  const out = {} as Customer;

  for (const key of REQUIRED) {
    const value = raw[key];
    if (typeof value !== "string" || !value.trim()) return null;
    out[key] = value.trim().slice(0, 200);
  }
  if (!/^\d{6}$/.test(out.pincode)) return null;
  // Ten digits, with an optional +91 or 0 in front — enough to catch a typo
  // without rejecting how people actually write their number.
  if (!/^(\+?91|0)?[6-9]\d{9}$/.test(out.phone.replace(/[\s-]/g, ""))) return null;
  return out;
}

/**
 * Opens a payment.
 *
 * Takes a cart and a delivery address, prices the cart HERE, registers that
 * amount with Razorpay, records the order as pending, and hands the browser
 * only what the modal needs. Note what is not in the request body: money.
 */
export async function POST(req: Request) {
  const creds = credentials();
  if (!creds) {
    // Loud, because the alternative is a checkout button that silently does
    // nothing on a deploy where the keys were never set.
    console.error("[checkout] Razorpay keys missing — see .env.example");
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const { lines, customer } = (body ?? {}) as Record<string, unknown>;

  const parsedCustomer = parseCustomer(customer);
  if (!parsedCustomer) {
    return NextResponse.json({ error: "Those delivery details look incomplete." }, { status: 400 });
  }

  const priced = quote(parseLines(lines));
  if (priced.lines.length === 0 || priced.total <= 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const ref = newRef();

  try {
    const rzpOrder = await createOrder(creds, toPaise(priced.total), ref, {
      ref,
      // Surfaces in the Razorpay dashboard next to the payment, so a support
      // call can be answered without cross-referencing anything.
      customer: parsedCustomer.name,
      phone: parsedCustomer.phone,
    });

    await saveOrder({
      ref,
      razorpayOrderId: rzpOrder.id,
      status: "pending",
      quote: priced,
      customer: parsedCustomer,
      createdAt: new Date().toISOString(),
    });

    // keyId is the publishable half of the pair and is meant to reach the
    // browser. keySecret must never appear in this response.
    return NextResponse.json({
      ref,
      keyId: creds.keyId,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
    });
  } catch (err) {
    console.error("[checkout] could not open payment", err);
    return NextResponse.json({ error: "Could not reach payments. Try again." }, { status: 502 });
  }
}
