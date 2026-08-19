import { NextResponse } from "next/server";
import { credentials, verifyWebhook } from "@/lib/razorpay";
import { markOrder } from "@/lib/orders";

export const runtime = "nodejs";
/** Never cached, never prerendered — this is a side effect, not a page. */
export const dynamic = "force-dynamic";

/**
 * The only thing that decides an order is paid.
 *
 * The browser's success callback is a UI event, not evidence: it can be forged,
 * and it goes missing every time somebody closes the tab the moment their UPI
 * app says "done". Razorpay's own servers post here instead, signed with a
 * shared secret, whether or not the customer stayed on the page.
 *
 * Razorpay retries until it gets a 2xx, so this must be safe to run repeatedly
 * for the same payment — see `markOrder`. It also means a 500 here is not a
 * lost order; it will come back.
 */
export async function POST(req: Request) {
  const creds = credentials();
  if (!creds) {
    console.error("[webhook] Razorpay keys missing — see .env.example");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  // Raw text, not req.json(). The signature covers these exact bytes, and
  // parsing then re-serialising would change them.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature || !verifyWebhook(raw, signature, creds.webhookSecret)) {
    // Anyone can POST here. Unsigned traffic is refused before it can touch an
    // order, and gets no detail about why.
    console.warn("[webhook] rejected an unsigned or mis-signed request");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  let event: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id;
  if (!orderId) {
    // Some event we do not act on. Acknowledge it so Razorpay stops retrying.
    return NextResponse.json({ ok: true });
  }

  if (event.event === "payment.captured") {
    const { order, changed } = await markOrder(orderId, "paid", payment?.id);

    if (changed && order) {
      // ── The gap that matters ────────────────────────────────────────────
      // Money has arrived and there is a box to pack. Nobody is watching this
      // server, so this is where Maaya has to be told: an email, a WhatsApp,
      // a row appearing in a sheet she has open. Until something goes here,
      // a paid order is a line in a JSON file that no human ever reads.
      console.log(`[webhook] PAID ${order.ref} — ₹${order.quote.total} — ${order.customer.name}`);
    }
    return NextResponse.json({ ok: true });
  }

  if (event.event === "payment.failed") {
    // Recorded rather than deleted: a customer whose payment failed will often
    // ring up about it, and "we can see the attempt" is a better answer than
    // "we have no record of you".
    await markOrder(orderId, "failed", payment?.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
