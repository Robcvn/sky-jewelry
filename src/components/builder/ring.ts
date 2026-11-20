/*
 * The ring being built, as it lives in the URL, and the builder's routes. Pure functions.
 *
 * Routes (setting-first flow):
 *   /design-your-own/                       Step 1: choose a setting (list)
 *   /design-your-own/setting/<handle>/      Step 1: the setting's page
 *   /design-your-own/stone/                 Step 2: choose a stone (list)
 *   /design-your-own/stone/<handle>/        Step 2: the stone's page
 *   /design-your-own/complete/              Step 3: planned (part 2)
 *
 * Query, carried from page to page so a ring can be linked to and resumed:
 *   setting=<handle>          the chosen setting (from Step 2 on)
 *   metal=14k-white-gold      the setting's metal
 *   shape=round               the centre stone shape: a setting option, and Step 2's shape filter
 *   stone=<handle>            the chosen stone (Step 3)
 *   start=lab-diamond         what the menu link started with: sets Step 2's tab or its gemstone mode
 * The list pages add their own filters (see settingFilters.ts and stoneFilters.ts).
 */
import { STONE_SHAPES, type GemType, type StoneKind, type StoneOrigin, type StoneShape } from "@/content/builder";
import { metalById, parseMetal, type MetalId } from "@/content/metals";
import type { Product } from "@/content/products";

export type Ring = {
  setting: string | null;
  metal: MetalId | null;
  shape: StoneShape | null;
  stone: string | null;
  start: string | null;
};

export const EMPTY_RING: Ring = { setting: null, metal: null, shape: null, stone: null, start: null };

export const parseShape = (value: string | null | undefined): StoneShape | null => STONE_SHAPES.find((shape) => shape.value === value)?.value ?? null;

export function parseRing(params: URLSearchParams): Ring {
  return {
    setting: params.get("setting") || null,
    metal: parseMetal(params.get("metal")),
    shape: parseShape(params.get("shape")),
    stone: params.get("stone") || null,
    start: params.get("start") || null,
  };
}

/** The ring's own query parameters, in a fixed order. */
export function ringParams(ring: Partial<Ring>) {
  const params = new URLSearchParams();
  if (ring.setting) params.set("setting", ring.setting);
  if (ring.metal) params.set("metal", ring.metal);
  if (ring.shape) params.set("shape", ring.shape);
  if (ring.stone) params.set("stone", ring.stone);
  if (ring.start) params.set("start", ring.start);
  return params;
}

const withQuery = (path: string, params: URLSearchParams) => (params.size ? `${path}?${params}` : path);

export const SETTINGS_PATH = "/design-your-own/";
export const STONES_PATH = "/design-your-own/stone/";

/** Step 1 list. Drops the chosen setting; keeps where the shopper started. */
export const settingsHref = (ring: Partial<Ring> = {}) => withQuery(SETTINGS_PATH, ringParams({ start: ring.start }));
/** A setting's page, with the metal and shape chosen so far. */
export const settingHref = (handle: string, ring: Partial<Ring> = {}) =>
  withQuery(`/design-your-own/setting/${handle}/`, ringParams({ metal: ring.metal, shape: ring.shape, start: ring.start }));
/** Step 2 list for a ring whose setting is chosen. */
export const stonesHref = (ring: Partial<Ring>) => withQuery(STONES_PATH, ringParams({ setting: ring.setting, metal: ring.metal, shape: ring.shape, start: ring.start }));
/** A stone's page, carrying the ring. */
export const stoneHref = (handle: string, ring: Partial<Ring> = {}) =>
  withQuery(`/design-your-own/stone/${handle}/`, ringParams({ setting: ring.setting, metal: ring.metal, shape: ring.shape, start: ring.start }));
/** Step 3 (planned): the ring with its stone. */
export const completeHref = (ring: Partial<Ring>) => withQuery("/design-your-own/complete/", ringParams({ ...ring, start: null }));

/**
 * What a menu link's ?start= means for Step 2: the tab (natural or lab-grown), diamond or gemstone mode, and the
 * gemstone type. "setting" and unknown values start with natural diamonds, Figma's default tab.
 */
export function startDefaults(start: string | null): { origin: StoneOrigin; kind: StoneKind; gem: GemType | null } {
  switch (start) {
    case "lab-diamond":
      return { origin: "lab-grown", kind: "diamond", gem: null };
    case "gemstone":
      return { origin: "natural", kind: "gemstone", gem: null };
    case "sapphire":
      return { origin: "natural", kind: "gemstone", gem: "sapphire" };
    case "emerald":
      return { origin: "natural", kind: "gemstone", gem: "emerald" };
    case "moissanite":
      return { origin: "lab-grown", kind: "gemstone", gem: "moissanite" };
    default:
      return { origin: "natural", kind: "diamond", gem: null };
  }
}

/** "Vine Engagement Ring Setting": the setting's name without its metal, as the list cards show it. */
export const settingTitle = (product: Pick<Product, "titleTemplate">) =>
  product.titleTemplate.replace(/\s+in\s+\{metal\}/i, "").replace("{metal}", "").replace("{carat}", "").replace(/\s+/g, " ").trim();

/** "Vine 14K White Gold": the short name in the step bar, as Figma's "Petite Pavé 14k White Gold". */
export const settingShortName = (product: Pick<Product, "titleTemplate">, metal: MetalId) =>
  `${settingTitle(product).replace(/\s*(Engagement Ring Setting|Ring Setting|Ring)$/i, "")} ${metalById(metal).label}`;

/** The setting's variant for a metal (its default when the metal isn't offered). */
export const settingVariant = (product: Product, metal: MetalId | null) => product.variants.find((variant) => variant.metal === metal) ?? product.variants[0];
