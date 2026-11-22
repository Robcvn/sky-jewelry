/*
 * Step 1 (choose a setting): filtering, sorting and URL state. Pure functions, run in the browser over the
 * settings fetched at build time, like the product list's (src/components/plp/filters.ts).
 *
 * URL query (all optional):
 *   style=solitaire          setting style (one); also the menu's Tension and Vintage, which no setting has
 *   shape=round              "Set with": the centre stone shape the ring is being built for
 *   metal=14k-yellow-gold    metal ids (comma-separated), or a colour family from the menu
 *   price=500-3000           price range in USD
 *   ships=5                  ships within this many days
 *   sort=price-asc           best-match (default), price-asc, price-desc
 *   page=2                   how many View More pages are open
 *   start=lab-diamond        carried from the menu link to Step 2 (see ring.ts)
 */
import { MENU_ONLY_STYLES, SETTING_STYLES, type FilterStyle, type StoneShape } from "@/content/builder";
import { metalsForParam, type MetalId } from "@/content/metals";
import type { ProductVariant } from "@/content/products";
import { preferStudio } from "@/lib/swatches";
import type { RingSetting } from "@/lib/builder";
import { parseShape } from "./ring";

export type Range = [number, number];

export type SettingFilterState = {
  style: FilterStyle | null;
  shape: StoneShape | null;
  metals: MetalId[];
  price: Range | null;
  ships: number | null;
  sort: string;
  page: number;
  start: string | null;
};

export const EMPTY_SETTING_FILTERS: SettingFilterState = { style: null, shape: null, metals: [], price: null, ships: null, sort: "best-match", page: 1, start: null };

const list = (value: string | null) => (value ? value.split(",").map((item) => item.trim()).filter(Boolean) : []);

function range(value: string | null): Range | null {
  const match = value?.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  const [min, max] = [Number(match[1]), Number(match[2])];
  return min <= max ? [min, max] : [max, min];
}

export function parseSettingFilters(params: URLSearchParams): SettingFilterState {
  const ships = Number(params.get("ships"));
  const page = Number(params.get("page"));
  const sort = params.get("sort");
  return {
    style: [...SETTING_STYLES, ...MENU_ONLY_STYLES].find((item) => item.value === params.get("style"))?.value ?? null,
    shape: parseShape(params.get("shape")),
    metals: [...new Set(list(params.get("metal")).flatMap(metalsForParam))],
    price: range(params.get("price")),
    ships: Number.isInteger(ships) && ships > 0 ? ships : null,
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "best-match",
    page: Number.isInteger(page) && page > 1 ? page : 1,
    start: params.get("start") || null,
  };
}

export function serializeSettingFilters(state: SettingFilterState) {
  const params = new URLSearchParams();
  if (state.style) params.set("style", state.style);
  if (state.shape) params.set("shape", state.shape);
  if (state.metals.length) params.set("metal", state.metals.join(","));
  if (state.price) params.set("price", `${state.price[0]}-${state.price[1]}`);
  if (state.ships) params.set("ships", String(state.ships));
  if (state.sort !== "best-match") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.start) params.set("start", state.start);
  return params;
}

/** Price slider bounds, to the nearest $100 around every metal's price. */
export function settingPriceBounds(settings: RingSetting[]): Range {
  const prices = settings.flatMap((setting) => setting.product.variants.map((variant) => variant.price));
  return prices.length ? [Math.floor(Math.min(...prices) / 100) * 100, Math.ceil(Math.max(...prices) / 100) * 100] : [0, 0];
}

export const rangeActive = (value: Range | null, bounds: Range) => Boolean(value && (value[0] > bounds[0] || value[1] < bounds[1]));

export type SettingMatch = { setting: RingSetting; variant: ProductVariant };

/**
 * The settings that match, each with the first metal variant that matches, so a card shows the metal and price
 * the shopper filtered for. "Set with" does not narrow the list: every sample setting can be made for every
 * centre stone shape (an inference, listed in the report); it sets the shape the ring is built for.
 */
export function applySettingFilters(settings: RingSetting[], state: SettingFilterState, bounds: Range): SettingMatch[] {
  const price = rangeActive(state.price, bounds) ? state.price : null;
  const matches = settings.flatMap((setting): SettingMatch[] => {
    if (state.style && setting.style !== state.style) return [];
    if (state.ships && !(setting.product.shipsInDays !== null && setting.product.shipsInDays <= state.ships)) return [];
    const candidates = setting.product.variants.filter(
      (item) => (!state.metals.length || state.metals.includes(item.metal)) && (!price || (item.price >= price[0] && item.price <= price[1])),
    );
    // Without a Metal filter the card opens on the first metal with a studio photo (swatches.ts).
    const variant = state.metals.length ? candidates[0] : preferStudio(setting.product, candidates);
    return variant ? [{ setting, variant }] : [];
  });
  if (state.sort === "price-asc") return matches.sort((a, b) => a.variant.price - b.variant.price);
  if (state.sort === "price-desc") return matches.sort((a, b) => b.variant.price - a.variant.price);
  return matches;
}

export const settingShipOptions = (settings: RingSetting[]) =>
  [...new Set(settings.map((setting) => setting.product.shipsInDays).filter((days): days is number => days !== null))].sort((a, b) => a - b);
