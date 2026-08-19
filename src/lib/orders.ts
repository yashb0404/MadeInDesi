import { promises as fs } from "node:fs";
import path from "node:path";
import type { Quote } from "@/lib/quote";

/**
 * Where orders live.
 *
 * ────────────────────────────────────────────────────────────────────────
 *  THIS IS A DEVELOPMENT STORE. IT MUST BE REPLACED BEFORE TAKING REAL MONEY.
 * ────────────────────────────────────────────────────────────────────────
 *
 * It writes a JSON file under `.data/`, which is enough to click through the
 * whole payment flow locally and actually see what got recorded. On a serverless
 * host the filesystem is read-only and per-instance, so on Vercel this quietly
 * keeps nothing.
 *
 * Everything else in the payment path is written against the four functions at
 * the bottom of this file and nothing else, so swapping in Postgres/Supabase is
 * a change to this file alone. What the replacement must provide:
 *
 *   - durability (an order survives the process that wrote it)
 *   - lookup by Razorpay order id, for the webhook
 *   - idempotent marking (Razorpay retries webhooks; the same payment may
 *     arrive several times and must not ship two boxes)
 *
 * ...plus the thing no database gives you: something that tells Maaya an order
 * arrived. A webhook lands on a server with nobody watching it.
 */

export type OrderStatus = "pending" | "paid" | "failed";

export type Customer = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  /** Ours — the human reference, the one the customer is shown. */
  ref: string;
  /** Razorpay's. The webhook only knows the order by this. */
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: OrderStatus;
  /** The priced quote as the server computed it, kept verbatim as the record. */
  quote: Quote;
  customer: Customer;
  createdAt: string;
  paidAt?: string;
};

const FILE = path.join(process.cwd(), ".data", "orders.json");

async function readAll(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(orders, null, 2), "utf8");
}

/**
 * A short human reference. Not a security token — it is printed on the
 * confirmation screen and read out over the phone, so it only has to be short,
 * unambiguous and unlikely to collide.
 */
export function newRef(): string {
  return `MA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function saveOrder(order: Order): Promise<void> {
  const all = await readAll();
  all.push(order);
  await writeAll(all);
}

export async function findByRazorpayOrderId(id: string): Promise<Order | undefined> {
  return (await readAll()).find((o) => o.razorpayOrderId === id);
}

/**
 * Records the outcome of a payment.
 *
 * Idempotent on purpose: Razorpay retries a webhook until it gets a 2xx, so
 * this runs more than once for the same payment as a matter of course. Returns
 * whether this call was the one that actually changed anything — the caller
 * uses that to decide whether to notify anyone, so retries do not send Maaya
 * four texts about one order.
 */
export async function markOrder(
  razorpayOrderId: string,
  status: OrderStatus,
  razorpayPaymentId?: string,
): Promise<{ order?: Order; changed: boolean }> {
  const all = await readAll();
  const order = all.find((o) => o.razorpayOrderId === razorpayOrderId);
  if (!order) return { changed: false };
  if (order.status === status) return { order, changed: false };

  order.status = status;
  order.razorpayPaymentId = razorpayPaymentId ?? order.razorpayPaymentId;
  if (status === "paid") order.paidAt = new Date().toISOString();
  await writeAll(all);
  return { order, changed: true };
}
