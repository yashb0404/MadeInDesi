"use client";

/**
 * The delivery address, remembered on this device.
 *
 * Deliberately not autofill. The details are held back and OFFERED — the
 * customer sees whose address it is and taps to use it. A shared laptop or a
 * phone handed to someone else should not quietly put a previous customer's
 * home address into a form, and an address that appears on its own is one
 * nobody reads before ordering.
 *
 * localStorage, not a cookie or an account: it never needs to reach the server
 * (the checkout already collects these fields when the order is placed), so
 * sending it on every request would be storing someone's home address in our
 * logs for no reason. It stays on the device and the customer can clear it.
 */

import { useSyncExternalStore } from "react";

export type SavedDetails = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

/**
 * Versioned. If the shape of the form ever changes, an old entry is dropped
 * rather than half-filling the new fields.
 */
const KEY = "maaya-delivery-v1";

const FIELDS: (keyof SavedDetails)[] = [
  "name",
  "phone",
  "address",
  "city",
  "state",
  "pincode",
];

/** Null on the server, and null for anything that is not a complete address. */
export function readSaved(): SavedDetails | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out = {} as SavedDetails;
    for (const key of FIELDS) {
      const value = parsed[key];
      if (typeof value !== "string" || !value.trim()) return null;
      out[key] = value;
    }
    return out;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) or hold
    // something we did not write. Either way: no saved address, carry on.
    return null;
  }
}

export function writeSaved(details: SavedDetails): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(details));
  } catch {
    // Remembering is a convenience. If it fails, the order still went through,
    // and there is nothing useful to say to the customer about it.
  }
  invalidate();
}

export function clearSaved(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {}
  invalidate();
}

/* ---- reading it from a component ---------------------------------------- */

/*
  localStorage is an external store, so it is read through the hook React
  provides for exactly that, the same way the cart reads its own persistence.
  Reading it in an effect instead would mean a setState on mount and a second
  render for every visit to checkout.

  The snapshot has to be cached rather than re-parsed on demand: getSnapshot
  must return the same object until the data actually changes, or React sees a
  new value every render and loops.
*/
let snapshot: SavedDetails | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function invalidate(): void {
  loaded = false;
  for (const listener of listeners) listener();
}

function getSnapshot(): SavedDetails | null {
  if (!loaded) {
    snapshot = readSaved();
    loaded = true;
  }
  return snapshot;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Fires when another tab writes the key, so forgetting the address in one
  // tab does not leave it offered in another.
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) invalidate();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The saved address, or null. Always null on the server and on first render. */
export function useSavedDetails(): SavedDetails | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

/** One line for the offer card: "12 Road, Hyderabad 500001". */
export function summarise(d: SavedDetails): string {
  return `${d.address}, ${d.city} ${d.pincode}`;
}
