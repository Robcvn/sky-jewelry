"use client";

/**
 * The shopper's bag, in the browser. Uses Shopify's cart API: the cart is created on the first Add to Bag and
 * its id is kept in localStorage, so the bag survives reloads. Lines, quantities, removal and totals all come
 * from the cart. Checkout stays simulated: the cart fields never include a checkout URL.
 * When the page was built from the mock catalogue (no Shopify variant ids), the bag is kept in localStorage
 * instead, so the panel and the bag page still work before the products are imported.
 *
 * Adding an item opens the bag panel (the header draws it); the panel state lives here so any page can open it.
 */
import { useSyncExternalStore } from "react";
import type { ImageRef } from "@/components/ui/Picture";
import { METALS, type MetalId } from "@/content/metals";
import { imagesFor, productHref, type Product, type ProductVariant } from "@/content/products";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  shopifyConfig,
  updateCartLines,
  type ShopifyCart,
  type ShopifyCartLine,
} from "@/lib/shopify";
import { caratOf, localImage, metalOf, slugify, tagValue } from "@/lib/shopify/mapProduct";

const CART_KEY = "sky-cart-id";
const LOCAL_LINES_KEY = "sky-bag-local-lines";
const OLD_LOCAL_COUNT_KEY = "sky-bag-local-count";

/** One line of the bag, the same shape whether it comes from Shopify or the local bag. */
export type BagLine = {
  /** Shopify cart line id, or "local:<variant>" for the local bag. */
  id: string;
  variantId: string | null;
  handle: string;
  /** Product category slug ("rings"), from Shopify's product type. */
  category: string;
  href: string;
  /** The product's name without metal and carat ("Four Prong Solitaire Lab-Grown Pendant"). */
  name: string;
  metal: MetalId;
  carat: number | null;
  /** Chain or bracelet length in inches ("16-18"), from the product's length: tag. */
  length: string | null;
  /** From the product's ships-in: tag. */
  shipsInDays: number | null;
  image: ImageRef | null;
  quantity: number;
  unitPrice: number;
  /** Price x quantity before line discounts. */
  subtotal: number;
  /** After line discounts. */
  total: number;
  available: boolean;
};

export type Bag = {
  lines: BagLine[];
  count: number;
  /** Sum of the lines before discounts. */
  subtotal: number;
  /** Line and order discounts the cart reports (0 when none). */
  discount: number;
  /** What the cart says the shopper pays, before care plans, shipping and taxes. */
  total: number;
  simulated: boolean;
};

type State = { bag: Bag; loaded: boolean; panelOpen: boolean; error: string | null; busyLine: string | null };

const EMPTY: Bag = { lines: [], count: 0, subtotal: 0, discount: 0, total: 0, simulated: false };
let state: State = { bag: EMPTY, loaded: false, panelOpen: false, error: null, busyLine: null };
const SERVER_STATE: State = state;
let started = false;
const listeners = new Set<() => void>();

const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
};

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

const money = (amount: { amount: string } | undefined) => Number(amount?.amount ?? 0) || 0;

const METAL_LABELS = METALS.map((metal) => metal.label).sort((a, b) => b.length - a.length);

/** "14K Yellow Gold Four Prong Solitaire 0.80ct Lab-Grown Pendant" -> "Four Prong Solitaire Lab-Grown Pendant". */
export function shortName(title: string) {
  let name = title;
  for (const label of METAL_LABELS) name = name.replace(new RegExp(label, "i"), "");
  return name.replace(/\b\d+(\.\d+)?\s?ct\b/i, "").replace(/\s+/g, " ").trim();
}

/** A Shopify cart line in the bag's shape. */
export function mapCartLine(line: ShopifyCartLine): BagLine {
  const { merchandise } = line;
  const product = merchandise.product;
  const category = slugify(product.productType) || "products";
  const discount = line.discountAllocations.reduce((sum, allocation) => sum + money(allocation.discountedAmount), 0);
  const subtotal = money(line.cost.subtotalAmount);
  return {
    id: line.id,
    variantId: merchandise.id,
    handle: product.handle,
    category,
    href: productHref({ category, slug: product.handle }),
    name: shortName(product.title),
    metal: metalOf(merchandise.selectedOptions, product.tags),
    carat: caratOf(merchandise.selectedOptions),
    length: tagValue(product.tags, "length"),
    shipsInDays: Number(tagValue(product.tags, "ships-in")) || null,
    image: merchandise.image ? localImage(merchandise.image.url, product.title) : null,
    quantity: line.quantity,
    unitPrice: money(line.cost.amountPerQuantity),
    subtotal,
    total: money(line.cost.totalAmount) || subtotal - discount,
    available: merchandise.availableForSale,
  };
}

export function mapCart(cart: ShopifyCart): Bag {
  const lines = cart.lines.nodes.map(mapCartLine);
  const lineDiscounts = lines.reduce((sum, line) => sum + (line.subtotal - line.total), 0);
  const orderDiscount = cart.discountAllocations.reduce((sum, allocation) => sum + money(allocation.discountedAmount), 0);
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = Math.max(0, Math.round((lineDiscounts + orderDiscount) * 100) / 100);
  return { lines, count: cart.totalQuantity, subtotal, discount, total: money(cart.cost.totalAmount) || subtotal - discount, simulated: false };
}

/* ---------- Local bag (mock catalogue builds) ---------- */

type LocalLine = Omit<BagLine, "subtotal" | "total">;

const readLocal = (): LocalLine[] => {
  try {
    const parsed = JSON.parse(read(LOCAL_LINES_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function localBag(lines: LocalLine[]): Bag {
  const full = lines.map((line) => ({ ...line, subtotal: line.unitPrice * line.quantity, total: line.unitPrice * line.quantity }));
  const subtotal = full.reduce((sum, line) => sum + line.subtotal, 0);
  return { lines: full, count: full.reduce((sum, line) => sum + line.quantity, 0), subtotal, discount: 0, total: subtotal, simulated: true };
}

const saveLocal = (lines: LocalLine[]) => {
  write(LOCAL_LINES_KEY, lines.length ? JSON.stringify(lines) : null);
  set({ bag: localBag(lines) });
};

/* ---------- Loading ---------- */

/** Loads the bag once per page view: Shopify's cart (if there is one), or the local bag. */
async function start() {
  if (started) return;
  started = true;
  write(OLD_LOCAL_COUNT_KEY, null);
  const cartId = read(CART_KEY);
  if (!cartId || !shopifyConfig()) {
    set({ bag: localBag(readLocal()), loaded: true });
    return;
  }
  try {
    const cart = await getCart(cartId);
    if (!cart) write(CART_KEY, null); // expired or completed
    set({ bag: cart ? mapCart(cart) : EMPTY, loaded: true });
  } catch {
    set({ loaded: true, error: "We couldn't load your bag. Please try again." });
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  void start();
  return () => listeners.delete(listener);
}

/** The bag, the panel state and any error. Empty on the server and until the cart has loaded. */
export function useBag() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
}

/** Number of items in the bag, for the header. */
export function useBagCount() {
  return useBag().bag.count;
}

export const openBagPanel = () => set({ panelOpen: true });
export const closeBagPanel = () => set({ panelOpen: false, error: null });

/* ---------- Changes ---------- */

export type AddResult = { ok: true; simulated: boolean } | { ok: false; message: string };

let queue: Promise<unknown> = Promise.resolve();
/** Cart changes run one at a time, so quick taps can't overtake each other. */
const serial = <T,>(task: () => Promise<T>) => {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
};

const errorText = (error: unknown) => (error instanceof Error ? error.message : "Something went wrong.");

/**
 * Adds a variant to the bag and opens the bag panel. Never throws: a failure is shown in the panel and returned.
 * `openPanel: false` (Secure Checkout on the product page, which goes to the bag page instead) skips the panel.
 */
export function addToBag(product: Product, variant: ProductVariant, quantity = 1, { openPanel = true } = {}): Promise<AddResult> {
  return serial(async () => {
    await start();
    if (!variant.id || !shopifyConfig()) {
      const lines = readLocal();
      const id = `local:${product._id}:${variant.metal}:${variant.carat ?? "-"}`;
      const existing = lines.find((line) => line.id === id);
      if (existing) existing.quantity += quantity;
      else
        lines.push({
          id,
          variantId: variant.id,
          handle: product._id,
          category: product.category,
          href: productHref(product),
          name: shortName(product.name),
          metal: variant.metal,
          carat: variant.carat,
          length: product.length,
          shipsInDays: product.shipsInDays,
          image: imagesFor(product, variant.metal)[0] ?? product.image,
          quantity,
          unitPrice: variant.price,
          available: variant.available,
        });
      saveLocal(lines);
      set({ error: null, panelOpen: openPanel || state.panelOpen });
      return { ok: true, simulated: true } as const;
    }

    const cartLines = [{ merchandiseId: variant.id, quantity }];
    try {
      const cartId = read(CART_KEY);
      let cart: ShopifyCart | null = null;
      if (cartId) {
        try {
          cart = await addCartLines(cartId, cartLines);
        } catch {
          cart = null; // the saved cart expired: start a new one below
        }
      }
      cart ??= await createCart(cartLines);
      write(CART_KEY, cart.id);
      set({ bag: mapCart(cart), loaded: true, error: null, panelOpen: openPanel || state.panelOpen });
      return { ok: true, simulated: false } as const;
    } catch (error) {
      // A failure always opens the panel, where the message shows.
      set({ error: `We couldn't add ${shortName(product.name)} to your bag. Please try again.`, panelOpen: true });
      return { ok: false, message: errorText(error) } as const;
    }
  });
}

/** Sets a line's quantity; 0 removes it. */
export function setLineQuantity(lineId: string, quantity: number) {
  if (quantity <= 0) return removeLine(lineId);
  return change(lineId, (cartId) => updateCartLines(cartId, [{ id: lineId, quantity }]), (lines) =>
    lines.map((line) => (line.id === lineId ? { ...line, quantity } : line)),
  );
}

export function removeLine(lineId: string) {
  return change(lineId, (cartId) => removeCartLines(cartId, [lineId]), (lines) => lines.filter((line) => line.id !== lineId));
}

function change(lineId: string, remote: (cartId: string) => Promise<ShopifyCart>, local: (lines: LocalLine[]) => LocalLine[]) {
  return serial(async () => {
    await start();
    if (lineId.startsWith("local:")) {
      saveLocal(local(readLocal()));
      return true;
    }
    const cartId = read(CART_KEY);
    if (!cartId) return false;
    set({ busyLine: lineId, error: null });
    try {
      set({ bag: mapCart(await remote(cartId)), busyLine: null });
      return true;
    } catch {
      set({ busyLine: null, error: "We couldn't update your bag. Please try again." });
      return false;
    }
  });
}

/** The header's Bag link: opens the bag panel instead of following the link (new-tab clicks still follow it). */
export function bagLinkClick(event: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; defaultPrevented: boolean; preventDefault: () => void }) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openBagPanel();
}
