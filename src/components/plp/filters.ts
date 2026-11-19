/*
 * Product list filtering, sorting and URL state. Pure functions: the listing runs them in the browser over
 * the products fetched at build time.
 *
 * URL query (all optional, comma-separated lists):
 *   type=diamond            menu sub-type (style tag)
 *   metal=14k-yellow-gold   metal ids, or a colour family from the menu (yellow-gold = 14K and 18K)
 *   diamond=natural         diamond types
 *   carat=0.50-2.00         carat range
 *   length=16-18,18-20      chain or bracelet lengths
 *   price=500-3000          price range in USD
 *   ships=3                 ships within this many days
 *   sort=price-asc          best-match (default), price-asc, price-desc
 *   page=2                  how many View More pages are open
 */
import type { DiamondType } from "@/content/catalog-seed";
import { METALS, metalById, metalsForParam, type MetalId } from "@/content/metals";
import type { FineJewelryCategory, Product, ProductVariant } from "@/content/products";

export type Range = [number, number];

export type FilterState = {
  type: string | null;
  metals: MetalId[];
  diamond: DiamondType[];
  carat: Range | null;
  length: string[];
  price: Range | null;
  ships: number | null;
  sort: string;
  page: number;
};

export const EMPTY_FILTERS: FilterState = {
  type: null,
  metals: [],
  diamond: [],
  carat: null,
  length: [],
  price: null,
  ships: null,
  sort: "best-match",
  page: 1,
};

export type FilterKey = "metal" | "diamond" | "carat" | "length" | "price";

/**
 * Which filters each category gets. From Figma: the Necklaces frames show Metal, Diamond Type, Carat Weight,
 * Length and Price. Length is a chain length, so rings and earrings don't get it; bracelets get a bracelet length.
 * A filter is also hidden when no product on the page has that attribute (for example ?type=gold leaves only
 * Metal and Price, like Figma's short sheet).
 */
export const CATEGORY_FILTERS: Record<FineJewelryCategory, FilterKey[]> = {
  rings: ["metal", "diamond", "carat", "price"],
  necklaces: ["metal", "diamond", "carat", "length", "price"],
  earrings: ["metal", "diamond", "carat", "price"],
  bracelets: ["metal", "diamond", "carat", "length", "price"],
};

const list = (value: string | null) => (value ? value.split(",").map((item) => item.trim()).filter(Boolean) : []);

function range(value: string | null): Range | null {
  const match = value?.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const [min, max] = [Number(match[1]), Number(match[2])];
  return min <= max ? [min, max] : [max, min];
}

export function parseFilters(params: URLSearchParams): FilterState {
  const ships = Number(params.get("ships"));
  const page = Number(params.get("page"));
  const sort = params.get("sort");
  return {
    type: params.get("type"),
    metals: [...new Set(list(params.get("metal")).flatMap(metalsForParam))],
    diamond: list(params.get("diamond")).filter((value): value is DiamondType => value === "natural" || value === "lab-grown"),
    carat: range(params.get("carat")),
    length: list(params.get("length")),
    price: range(params.get("price")),
    ships: Number.isInteger(ships) && ships > 0 ? ships : null,
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "best-match",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

export function serializeFilters(state: FilterState) {
  const params = new URLSearchParams();
  if (state.type) params.set("type", state.type);
  if (state.metals.length) params.set("metal", state.metals.join(","));
  if (state.diamond.length) params.set("diamond", state.diamond.join(","));
  if (state.carat) params.set("carat", `${state.carat[0].toFixed(2)}-${state.carat[1].toFixed(2)}`);
  if (state.length.length) params.set("length", state.length.join(","));
  if (state.price) params.set("price", `${state.price[0]}-${state.price[1]}`);
  if (state.ships) params.set("ships", String(state.ships));
  if (state.sort !== "best-match") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  return params.toString();
}

/** Bounds of the carat and price sliders for a set of products. */
export type Bounds = { carat: Range | null; price: Range };

export function boundsOf(products: Product[]): Bounds {
  const carats = products.flatMap((product) => product.variants.map((variant) => variant.carat)).filter((carat): carat is number => carat !== null);
  const prices = products.flatMap((product) => product.variants.map((variant) => variant.price));
  return {
    carat: carats.length ? [Math.floor(Math.min(...carats) * 20) / 20, Math.ceil(Math.max(...carats) * 20) / 20] : null,
    price: prices.length ? [Math.floor(Math.min(...prices) / 100) * 100, Math.ceil(Math.max(...prices) / 100) * 100] : [0, 0],
  };
}

/** A range filter only counts when it is narrower than the slider's bounds. */
export const rangeActive = (value: Range | null, bounds: Range | null) =>
  Boolean(value && bounds && (value[0] > bounds[0] || value[1] < bounds[1]));

export type Match = { product: Product; variant: ProductVariant };

const inRange = (value: number, [min, max]: Range) => value >= min - 1e-9 && value <= max + 1e-9;

/**
 * The products that match, each with the first variant that matches (the default variant when nothing
 * narrows it), so a card shows the metal, carat and price the shopper filtered for.
 */
export function applyFilters(products: Product[], state: FilterState, bounds: Bounds): Match[] {
  const carat = rangeActive(state.carat, bounds.carat) ? state.carat : null;
  const price = rangeActive(state.price, bounds.price) ? state.price : null;

  const matches = products.flatMap((product): Match[] => {
    if (state.type && !product.styles.includes(state.type)) return [];
    if (state.diamond.length && !(product.diamondType && state.diamond.includes(product.diamondType))) return [];
    if (state.length.length && !(product.length && state.length.includes(product.length))) return [];
    if (state.ships && !(product.shipsInDays !== null && product.shipsInDays <= state.ships)) return [];
    const variant = product.variants.find(
      (item) =>
        (!state.metals.length || state.metals.includes(item.metal)) &&
        (!carat || (item.carat !== null && inRange(item.carat, carat))) &&
        (!price || inRange(item.price, price)),
    );
    return variant ? [{ product, variant }] : [];
  });

  if (state.sort === "price-asc") return matches.sort((a, b) => a.variant.price - b.variant.price || a.product.rank - b.product.rank);
  if (state.sort === "price-desc") return matches.sort((a, b) => b.variant.price - a.variant.price || a.product.rank - b.product.rank);
  return matches;
}

/** The filters shown for a category: its Figma set, minus any no product on the page can use. */
export function visibleFilters(category: FineJewelryCategory, products: Product[]): FilterKey[] {
  return CATEGORY_FILTERS[category].filter((key) => {
    if (key === "diamond") return products.some((product) => product.diamondType);
    if (key === "carat") return products.some((product) => product.variants.some((variant) => variant.carat !== null));
    if (key === "length") return products.some((product) => product.length);
    return true;
  });
}

/** Ship-by choices: one per lead time in the catalogue. */
export const shipOptions = (products: Product[]) =>
  [...new Set(products.map((product) => product.shipsInDays).filter((days): days is number => days !== null))].sort((a, b) => a - b);

/** "Tue, Nov 24": the date an order placed today ships by. Browser only (it depends on today's date). */
export function shipDateLabel(days: number, today = new Date()) {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(date);
}

export const lengthLabel = (length: string) => `${length.replace("-", "–")}”`;

export const metalOptions = () => METALS;
export const metalLabel = (id: MetalId) => metalById(id).label;
