"use client";

/**
 * The shopper's bag, in the browser. Uses Shopify's cart API: the cart is created on the first Add to Bag and
 * its id is kept in localStorage, so the Bag count in the header survives reloads. Checkout stays simulated:
 * the cart fields never include a checkout URL.
 * When the page was built from the mock catalogue (no Shopify variant ids), adding is simulated with a
 * local count, so the button still works before the products are imported.
 */
import { useSyncExternalStore } from "react";
import { addCartLines, createCart, getCart, shopifyConfig, type ShopifyCart } from "@/lib/shopify";

const CART_KEY = "sky-cart-id";
const LOCAL_COUNT_KEY = "sky-bag-local-count";

let count = 0;
let started = false;
const listeners = new Set<() => void>();

const read = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string | null) => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode, site data off). The bag still works for this page view.
  }
};

const localCount = () => Number(read(LOCAL_COUNT_KEY)) || 0;

function setCount(next: number) {
  count = next;
  listeners.forEach((listener) => listener());
}

/** Loads the count once per page view: Shopify's cart (if there is one) plus any simulated adds. */
async function start() {
  if (started) return;
  started = true;
  setCount(localCount());
  const cartId = read(CART_KEY);
  if (!cartId || !shopifyConfig()) return;
  try {
    const cart = await getCart(cartId);
    if (!cart) write(CART_KEY, null); // expired or completed
    setCount((cart?.totalQuantity ?? 0) + localCount());
  } catch {
    // Offline or Shopify unavailable: keep the local count.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  void start();
  return () => listeners.delete(listener);
}

/** Number of items in the bag, for the header. 0 on the server and until the cart has loaded. */
export function useBagCount() {
  return useSyncExternalStore(
    subscribe,
    () => count,
    () => 0,
  );
}

export type AddResult = { ok: true; simulated: boolean } | { ok: false; message: string };

/** Adds one of a variant to the bag. Never throws; the caller shows the result. */
export async function addToBag(variantId: string | null, quantity = 1): Promise<AddResult> {
  await start();
  if (!variantId || !shopifyConfig()) {
    write(LOCAL_COUNT_KEY, String(localCount() + quantity));
    setCount(count + quantity);
    return { ok: true, simulated: true };
  }

  const lines = [{ merchandiseId: variantId, quantity }];
  try {
    const cartId = read(CART_KEY);
    let cart: ShopifyCart | null = null;
    if (cartId) {
      try {
        cart = await addCartLines(cartId, lines);
      } catch {
        cart = null; // the saved cart expired: start a new one below
      }
    }
    cart ??= await createCart(lines);
    write(CART_KEY, cart.id);
    setCount(cart.totalQuantity + localCount());
    return { ok: true, simulated: false };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Something went wrong." };
  }
}
