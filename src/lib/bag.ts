"use client";

/**
 * The shopper's bag, in the browser. Uses Shopify's cart API: the cart is created on the first Add to Bag and
 * its id is kept in localStorage, so the bag survives reloads. Lines, quantities, removal and totals all come
 * from the cart. Checkout stays simulated: the cart fields never include a checkout URL.
 * When the page was built from the mock catalogue (no Shopify variant ids), the bag is kept in localStorage
 * instead, so the panel and the bag page still work before the products are imported.
 *
 * Adding an item opens the bag panel (the header draws it); the panel state lives here so any page can open it.
 *
 * A ring built in the ring builder is two cart lines, the setting's variant and the stone's, added in one cart call
 * and linked by two line attributes: a ring id ("_ring") and the ring size ("Ring Size"). bagItems() groups them back
 * into one ring; the ring counts as one item, and removing either line removes both.
 * Earrings built in the earrings builder work the same way: the setting's line and the matched pair's line, linked
 * by an earrings id ("_earrings"); they have no size.
 */
import { useSyncExternalStore } from "react";
import { completeHref, parseShape } from "@/components/builder/ring";
import { earringsCompleteHref } from "@/components/earrings/routes";
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
  type CartAttribute,
  type CartLineInput,
  type ShopifyCart,
  type ShopifyCartLine,
} from "@/lib/shopify";
import type { Stone } from "@/lib/builder";
import type { StonePair } from "@/lib/earrings";
import { caratOf, localImage, LOOSE_STONE_TAG, metalOf, slugify, STONE_PAIR_TAG, tagValue } from "@/lib/shopify/mapProduct";

const CART_KEY = "sky-cart-id";
const LOCAL_LINES_KEY = "sky-bag-local-lines";
const OLD_LOCAL_COUNT_KEY = "sky-bag-local-count";

/** Line attribute keys of a built ring. The leading underscore keeps the id out of Shopify's checkout and order views. */
export const RING_ID_KEY = "_ring";
export const RING_SIZE_KEY = "Ring Size";
/** A ring built stone first carries "_first: stone", so the bag's links return to that flow's steps. */
export const RING_FIRST_KEY = "_first";
/** Line attribute key of built earrings (their two lines share it). */
export const EARRINGS_ID_KEY = "_earrings";

/**
 * A built piece's part: the piece it belongs to, its size and which part this line is. `build` says which builder
 * made it: a ring (setting and stone) or earrings (setting and matched pair, no size).
 */
export type BagRingPart = { id: string; size: string | null; role: "setting" | "stone"; build: "ring" | "earrings"; first?: "stone" | null };

/** A loose stone's facts (a ring's stone line), read from its tags as the builder catalogue does. */
export type BagStone = {
  kind: "diamond" | "gemstone";
  origin: "natural" | "lab-grown";
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  gem?: string;
  /** A matched pair's two weights (carat is then the pair's total). */
  pair?: [number, number];
};

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
  /** The product's full title ("0.50ct I VVS2 Round Natural Diamond"). */
  title: string;
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
  /** Set on the two lines of a built ring; null for a single piece. */
  ring: BagRingPart | null;
  /** Set on a ring's stone line. */
  stone: BagStone | null;
};

export type Bag = {
  lines: BagLine[];
  /** Items in the bag for the header and the headings: a built ring counts once. */
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

const attribute = (attributes: CartAttribute[] | undefined, key: string) => attributes?.find((item) => item.key === key)?.value || null;

const isStoneProduct = (product: { productType: string; tags: string[] }) =>
  product.tags.includes(LOOSE_STONE_TAG) || product.tags.includes(STONE_PAIR_TAG) || /loose stones?|stone pairs?/i.test(product.productType);

/** A stone's facts from its tags (the tags src/lib/builder.ts reads). */
export function stoneFromTags(tags: string[]): BagStone | null {
  const kind = tagValue(tags, "stone");
  const origin = tagValue(tags, "origin");
  const shape = tagValue(tags, "shape");
  if ((kind !== "diamond" && kind !== "gemstone") || (origin !== "natural" && origin !== "lab-grown") || !shape) return null;
  const pair = [Number(tagValue(tags, "a-carat")), Number(tagValue(tags, "b-carat"))] as [number, number];
  return {
    kind,
    origin,
    shape,
    carat: Number(tagValue(tags, "carat")) || 0,
    color: tagValue(tags, "color") ?? "",
    clarity: tagValue(tags, "clarity") ?? "",
    cut: tagValue(tags, "cut") ?? "",
    gem: tagValue(tags, "gem") ?? undefined,
    ...(tags.includes(STONE_PAIR_TAG) && pair.every((carat) => Number.isFinite(carat) && carat > 0) ? { pair } : {}),
  };
}

/** A Shopify cart line in the bag's shape. */
export function mapCartLine(line: ShopifyCartLine): BagLine {
  const { merchandise } = line;
  const product = merchandise.product;
  const category = slugify(product.productType) || "products";
  const ringId = attribute(line.attributes, RING_ID_KEY);
  const earringsId = attribute(line.attributes, EARRINGS_ID_KEY);
  const stoneLine = isStoneProduct(product);
  const discount = line.discountAllocations.reduce((sum, allocation) => sum + money(allocation.discountedAmount), 0);
  const subtotal = money(line.cost.subtotalAmount);
  return {
    id: line.id,
    variantId: merchandise.id,
    handle: product.handle,
    category,
    href: productHref({ category, slug: product.handle }),
    name: shortName(product.title),
    title: product.title,
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
    ring: ringId
      ? {
          id: ringId,
          size: attribute(line.attributes, RING_SIZE_KEY),
          role: stoneLine ? "stone" : "setting",
          build: "ring",
          first: attribute(line.attributes, RING_FIRST_KEY) === "stone" ? "stone" : null,
        }
      : earringsId
        ? { id: earringsId, size: null, role: stoneLine ? "stone" : "setting", build: "earrings" }
        : null,
    stone: stoneLine ? stoneFromTags(product.tags) : null,
  };
}

/* ---------- Built rings ---------- */

export type BagRingItem = {
  kind: "ring";
  /** Which builder made it: a ring, or earrings (whose stone line is a matched pair). */
  build: "ring" | "earrings";
  /** "stone" when the ring was built stone first. */
  first: "stone" | null;
  key: string;
  id: string;
  size: string | null;
  setting: BagLine | null;
  stone: BagLine | null;
  /** Both lines (one if the other has gone from the cart). */
  lines: BagLine[];
  subtotal: number;
  total: number;
  available: boolean;
};
export type BagItem = { kind: "line"; key: string; line: BagLine } | BagRingItem;

/** The bag's lines as the shopper sees them: single pieces, and each built ring as one item, in the order first added. */
export function bagItems(lines: BagLine[]): BagItem[] {
  const items: BagItem[] = [];
  const rings = new Map<string, BagRingItem>();
  for (const line of lines) {
    if (!line.ring) {
      items.push({ kind: "line", key: line.id, line });
      continue;
    }
    let ring = rings.get(line.ring.id);
    if (!ring) {
      ring = {
        kind: "ring",
        build: line.ring.build ?? "ring",
        first: line.ring.first ?? null,
        key: `ring:${line.ring.id}`,
        id: line.ring.id,
        size: line.ring.size,
        setting: null,
        stone: null,
        lines: [],
        subtotal: 0,
        total: 0,
        available: true,
      };
      rings.set(line.ring.id, ring);
      items.push(ring);
    }
    if (line.ring.role === "stone") ring.stone = line;
    else ring.setting = line;
    ring.lines.push(line);
    ring.size ??= line.ring.size;
    ring.subtotal += line.subtotal;
    ring.total += line.total;
    ring.available &&= line.available;
  }
  return items;
}

/** The header's count: pieces by quantity, a built ring once. */
export const itemCount = (lines: BagLine[]) =>
  bagItems(lines).reduce((sum, item) => sum + (item.kind === "ring" ? Math.max(1, ...item.lines.map((line) => line.quantity)) : item.line.quantity), 0);

/** Step 3 with the ring (or the earrings) in the URL, for a bag ring's links (Edit, its name and photo). */
export function ringHref(ring: Pick<BagRingItem, "setting" | "stone" | "size"> & { build?: BagRingItem["build"]; first?: BagRingItem["first"] }) {
  if (ring.build === "earrings")
    return ring.setting
      ? earringsCompleteHref({ setting: ring.setting.handle, metal: ring.setting.metal, shape: parseShape(ring.stone?.stone?.shape), stone: ring.stone?.handle ?? null })
      : "/design-your-own/earrings/";
  if (!ring.setting) return "/design-your-own/";
  return completeHref({
    setting: ring.setting.handle,
    metal: ring.setting.metal,
    shape: parseShape(ring.stone?.stone?.shape),
    stone: ring.stone?.handle ?? null,
    size: (ring.size as never) ?? null,
    first: ring.first ?? null,
  });
}

export function mapCart(cart: ShopifyCart): Bag {
  const lines = cart.lines.nodes.map(mapCartLine);
  const lineDiscounts = lines.reduce((sum, line) => sum + (line.subtotal - line.total), 0);
  const orderDiscount = cart.discountAllocations.reduce((sum, allocation) => sum + money(allocation.discountedAmount), 0);
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = Math.max(0, Math.round((lineDiscounts + orderDiscount) * 100) / 100);
  return { lines, count: itemCount(lines), subtotal, discount, total: money(cart.cost.totalAmount) || subtotal - discount, simulated: false };
}

/* ---------- Local bag (mock catalogue builds) ---------- */

type LocalLine = Omit<BagLine, "subtotal" | "total">;

const readLocal = (): LocalLine[] => {
  try {
    const parsed = JSON.parse(read(LOCAL_LINES_KEY) ?? "[]");
    // Lines saved before rings existed have no title, ring or stone; rings saved before earrings have no build.
    return Array.isArray(parsed)
      ? parsed.map((line: LocalLine) => ({ ...line, title: line.title ?? line.name, ring: line.ring ? { ...line.ring, build: line.ring.build ?? "ring" } : null, stone: line.stone ?? null }))
      : [];
  } catch {
    return [];
  }
};

function localBag(lines: LocalLine[]): Bag {
  const full = lines.map((line) => ({ ...line, subtotal: line.unitPrice * line.quantity, total: line.unitPrice * line.quantity }));
  const subtotal = full.reduce((sum, line) => sum + line.subtotal, 0);
  return { lines: full, count: itemCount(full), subtotal, discount: 0, total: subtotal, simulated: true };
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
          title: product.name,
          metal: variant.metal,
          carat: variant.carat,
          length: product.length,
          shipsInDays: product.shipsInDays,
          image: imagesFor(product, variant.metal)[0] ?? product.image,
          quantity,
          unitPrice: variant.price,
          available: variant.available,
          ring: null,
          stone: null,
        });
      saveLocal(lines);
      set({ error: null, panelOpen: openPanel || state.panelOpen });
      return { ok: true, simulated: true } as const;
    }

    return addCart([{ merchandiseId: variant.id, quantity }], shortName(product.name), openPanel);
  });
}

/** Adds lines to the saved cart, or a new cart when there is none (or it expired). Runs inside serial(). */
async function addCart(cartLines: CartLineInput[], name: string, openPanel: boolean): Promise<AddResult> {
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
    return { ok: true, simulated: false };
  } catch (error) {
    // A failure always opens the panel, where the message shows.
    set({ error: `We couldn't add ${name} to your bag. Please try again.`, panelOpen: true });
    return { ok: false, message: errorText(error) };
  }
}

const newRingId = () => {
  try {
    return window.crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
};

export type RingToAdd = {
  setting: Product;
  settingVariant: ProductVariant;
  stone: Stone;
  size: string;
  /** The ring's name in the bag ("Vine Ring"), for a failure message. */
  name: string;
  /** "stone" when built stone first: stored with the lines so the bag's Edit returns to that flow. */
  first?: "stone" | null;
};

/**
 * Adds a built ring: the setting's variant and the stone's variant as two lines in one cart call, linked by the ring
 * id and size attributes, then opens the bag panel (unless openPanel is false, as for Secure Checkout).
 * A stone is one of a kind: when this stone is already in the bag, nothing is added and the bag opens instead.
 */
export function addRing({ setting, settingVariant, stone, size, name, first }: RingToAdd, { openPanel = true } = {}): Promise<AddResult> {
  return serial(async () => {
    await start();
    if (state.bag.lines.some((line) => line.ring && line.handle === stone.handle)) {
      set({ error: null, panelOpen: openPanel || state.panelOpen });
      return { ok: true, simulated: state.bag.simulated } as const;
    }
    const id = newRingId();
    if (!settingVariant.id || !stone.variantId || !shopifyConfig()) {
      const lines = readLocal();
      const settingLine: LocalLine = {
        id: `local:ring:${id}:setting`,
        variantId: settingVariant.id,
        handle: setting._id,
        category: setting.category,
        href: productHref(setting),
        name: shortName(setting.name),
        title: setting.name,
        metal: settingVariant.metal,
        carat: null,
        length: null,
        shipsInDays: setting.shipsInDays,
        image: imagesFor(setting, settingVariant.metal)[0] ?? setting.image,
        quantity: 1,
        unitPrice: settingVariant.price,
        available: settingVariant.available,
        ring: { id, size, role: "setting", build: "ring", first: first ?? null },
        stone: null,
      };
      const stoneLine: LocalLine = {
        id: `local:ring:${id}:stone`,
        variantId: stone.variantId,
        handle: stone.handle,
        category: "loose-stones",
        href: `/design-your-own/stone/${stone.handle}/`,
        name: stone.title,
        title: stone.title,
        metal: settingVariant.metal,
        carat: stone.carat,
        length: null,
        shipsInDays: stone.shipsInDays,
        image: stone.image,
        quantity: 1,
        unitPrice: stone.price,
        available: stone.available,
        ring: { id, size, role: "stone", build: "ring", first: first ?? null },
        stone: { kind: stone.kind, origin: stone.origin, shape: stone.shape, carat: stone.carat, color: stone.color, clarity: stone.clarity, cut: stone.cut, gem: stone.gem },
      };
      saveLocal([...lines, settingLine, stoneLine]);
      set({ error: null, panelOpen: openPanel || state.panelOpen });
      return { ok: true, simulated: true } as const;
    }
    const attributes = [
      { key: RING_ID_KEY, value: id },
      { key: RING_SIZE_KEY, value: size },
      ...(first === "stone" ? [{ key: RING_FIRST_KEY, value: "stone" }] : []),
    ];
    return addCart(
      [
        { merchandiseId: settingVariant.id, quantity: 1, attributes },
        { merchandiseId: stone.variantId, quantity: 1, attributes },
      ],
      name,
      openPanel,
    );
  });
}

export type EarringsToAdd = {
  setting: Product;
  settingVariant: ProductVariant;
  pair: StonePair;
  /** The earrings' name in the bag, for a failure message. */
  name: string;
};

/**
 * Adds built earrings: the setting's variant and the pair's variant as two lines in one cart call, linked by the
 * earrings id attribute, then opens the bag panel (unless openPanel is false, as for Secure Checkout).
 * A pair is one of a kind: when this pair is already in the bag, nothing is added and the bag opens instead.
 */
export function addEarrings({ setting, settingVariant, pair, name }: EarringsToAdd, { openPanel = true } = {}): Promise<AddResult> {
  return serial(async () => {
    await start();
    if (state.bag.lines.some((line) => line.ring && line.handle === pair.handle)) {
      set({ error: null, panelOpen: openPanel || state.panelOpen });
      return { ok: true, simulated: state.bag.simulated } as const;
    }
    const id = newRingId();
    if (!settingVariant.id || !pair.variantId || !shopifyConfig()) {
      const lines = readLocal();
      const settingLine: LocalLine = {
        id: `local:earrings:${id}:setting`,
        variantId: settingVariant.id,
        handle: setting._id,
        category: setting.category,
        href: productHref(setting),
        name: shortName(setting.name),
        title: setting.name,
        metal: settingVariant.metal,
        carat: null,
        length: null,
        shipsInDays: setting.shipsInDays,
        image: imagesFor(setting, settingVariant.metal)[0] ?? setting.image,
        quantity: 1,
        unitPrice: settingVariant.price,
        available: settingVariant.available,
        ring: { id, size: null, role: "setting", build: "earrings" },
        stone: null,
      };
      const pairLine: LocalLine = {
        id: `local:earrings:${id}:stone`,
        variantId: pair.variantId,
        handle: pair.handle,
        category: "stone-pairs",
        href: `/design-your-own/earrings/stone/${pair.handle}/`,
        name: pair.title,
        title: pair.title,
        metal: settingVariant.metal,
        carat: pair.carat,
        length: null,
        shipsInDays: pair.shipsInDays,
        image: pair.image,
        quantity: 1,
        unitPrice: pair.price,
        available: pair.available,
        ring: { id, size: null, role: "stone", build: "earrings" },
        stone: {
          kind: pair.kind,
          origin: pair.origin,
          shape: pair.shape,
          carat: pair.carat,
          color: pair.color,
          clarity: pair.clarity,
          cut: pair.cut,
          pair: [pair.stones[0].carat, pair.stones[1].carat],
        },
      };
      saveLocal([...lines, settingLine, pairLine]);
      set({ error: null, panelOpen: openPanel || state.panelOpen });
      return { ok: true, simulated: true } as const;
    }
    const attributes = [{ key: EARRINGS_ID_KEY, value: id }];
    return addCart(
      [
        { merchandiseId: settingVariant.id, quantity: 1, attributes },
        { merchandiseId: pair.variantId, quantity: 1, attributes },
      ],
      name,
      openPanel,
    );
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
  return removeLines([lineId]);
}

/** Removes several lines in one cart call: a built ring's setting and stone lines go together. */
export function removeLines(lineIds: string[]) {
  return change(lineIds[0], (cartId) => removeCartLines(cartId, lineIds), (lines) => lines.filter((line) => !lineIds.includes(line.id)));
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
