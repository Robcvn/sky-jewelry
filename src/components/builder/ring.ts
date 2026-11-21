/*
 * The ring being built, as it lives in the URL, and the builder's routes. Pure functions.
 *
 * Routes (setting-first flow; the stone-first flow uses the same pages in the other order, marked by first=stone):
 *   /design-your-own/                       Step 1: choose a setting (list)        stone first: Step 2
 *   /design-your-own/setting/<handle>/      Step 1: the setting's page             stone first: Step 2
 *   /design-your-own/stone/                 Step 2: choose a stone (list)          stone first: Step 1
 *   /design-your-own/stone/<handle>/        Step 2: the stone's page               stone first: Step 1
 *   /design-your-own/complete/              Step 3: the complete ring
 *
 * Query, carried from page to page so a ring can be linked to and resumed:
 *   setting=<handle>          the chosen setting (from Step 2 on)
 *   metal=14k-white-gold      the setting's metal
 *   shape=round               the centre stone shape: a setting option, and Step 2's shape filter
 *   stone=<handle>            the chosen stone (Step 3)
 *   size=6.5                  the ring size chosen on Step 3
 *   start=lab-diamond         what the menu link started with: sets the stone list's tab or its gemstone mode
 *   first=stone               the ring is built stone first (Figma's Stone First Builder): the stone list is Step 1,
 *                             the settings list Step 2 (only settings that take the stone's shape), then Step 3
 * The list pages add their own filters (see settingFilters.ts and stoneFilters.ts).
 */
import { GEM_COLORS, GEM_TYPES, RING_SIZES, SETTING_SHAPE_ORDER, shapeLabel, STONE_SHAPES, type GemType, type RingSize, type StoneKind, type StoneOrigin, type StoneShape } from "@/content/builder";
import { metalById, parseMetal, type MetalId } from "@/content/metals";
import type { Product } from "@/content/products";

export type Ring = {
  setting: string | null;
  metal: MetalId | null;
  shape: StoneShape | null;
  stone: string | null;
  /** Step 3's ring size (one of Figma's ring size options). */
  size: RingSize | null;
  start: string | null;
  /** "stone" when the ring is built stone first; null for the setting-first flow. */
  first: "stone" | null;
};

export const EMPTY_RING: Ring = { setting: null, metal: null, shape: null, stone: null, size: null, start: null, first: null };

/** Whether the ring is built stone first (?first=stone). */
export const stoneFirst = (ring: Partial<Ring>) => ring.first === "stone";

export const parseRingSize = (value: string | null | undefined): RingSize | null => RING_SIZES.find((size) => size === value) ?? null;

export const parseShape = (value: string | null | undefined): StoneShape | null => STONE_SHAPES.find((shape) => shape.value === value)?.value ?? null;

export function parseRing(params: URLSearchParams): Ring {
  return {
    setting: params.get("setting") || null,
    metal: parseMetal(params.get("metal")),
    shape: parseShape(params.get("shape")),
    stone: params.get("stone") || null,
    size: parseRingSize(params.get("size")),
    start: params.get("start") || null,
    first: params.get("first") === "stone" ? "stone" : null,
  };
}

/** The ring's own query parameters, in a fixed order. */
export function ringParams(ring: Partial<Ring>) {
  const params = new URLSearchParams();
  if (ring.setting) params.set("setting", ring.setting);
  if (ring.metal) params.set("metal", ring.metal);
  if (ring.shape) params.set("shape", ring.shape);
  if (ring.stone) params.set("stone", ring.stone);
  if (ring.size) params.set("size", ring.size);
  if (ring.start) params.set("start", ring.start);
  if (ring.first) params.set("first", ring.first);
  return params;
}

const withQuery = (path: string, params: URLSearchParams) => (params.size ? `${path}?${params}` : path);

export const SETTINGS_PATH = "/design-your-own/";
export const STONES_PATH = "/design-your-own/stone/";

/**
 * The settings list without a chosen setting. Setting first (Step 1): keeps only where the shopper started. Stone
 * first (Step 2): keeps the chosen stone and its shape, which the list is limited to.
 */
export const settingsHref = (ring: Partial<Ring> = {}) =>
  withQuery(SETTINGS_PATH, stoneFirst(ring) ? ringParams({ shape: ring.shape, stone: ring.stone, start: ring.start, first: "stone" }) : ringParams({ start: ring.start }));
/** A setting's page, with the metal and shape chosen so far (and, stone first, the chosen stone). */
export const settingHref = (handle: string, ring: Partial<Ring> = {}) =>
  withQuery(
    `/design-your-own/setting/${handle}/`,
    ringParams({ metal: ring.metal, shape: ring.shape, stone: stoneFirst(ring) ? ring.stone : null, start: ring.start, first: ring.first }),
  );
/**
 * The stone list. Setting first (Step 2): for a ring whose setting is chosen. Stone first (Step 1): with whatever
 * the caller keeps (a setting chosen before is kept by Select New Stone, dropped by Remove).
 */
export const stonesHref = (ring: Partial<Ring>) =>
  withQuery(STONES_PATH, ringParams({ setting: ring.setting, metal: ring.metal, shape: ring.shape, start: ring.start, first: ring.first }));
/** A stone's page, carrying the ring. */
export const stoneHref = (handle: string, ring: Partial<Ring> = {}) =>
  withQuery(`/design-your-own/stone/${handle}/`, ringParams({ setting: ring.setting, metal: ring.metal, shape: ring.shape, start: ring.start, first: ring.first }));
/** Step 3: the ring with its stone and, once chosen, its size (and the order it was built in). */
export const completeHref = (ring: Partial<Ring>) => withQuery("/design-your-own/complete/", ringParams({ ...ring, start: null }));
/** Stone first, after choosing a stone: Step 2, the settings that take its shape. */
export const stoneFirstNextHref = (stone: { handle: string; shape: string }, ring: Partial<Ring> = {}) =>
  settingsHref({ first: "stone", stone: stone.handle, shape: parseShape(stone.shape), start: ring.start });
/** Stone first, Remove on the stone: back to Step 1 with nothing chosen. */
export const stoneFirstStartHref = (ring: Partial<Ring> = {}) => stonesHref({ start: ring.start, first: "stone" });

/**
 * What a menu link's ?start= means for the stone list: the tab (natural or lab-grown), diamond or gemstone mode, and the
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

/**
 * The centre stone shapes a setting takes. No product records them: every setting is offered in all ten shapes (the
 * setting page's Center Stone Shape picker), an inference listed in the report. Stone first, Step 2 lists only the
 * settings that take the chosen stone's shape.
 */
export const settingShapes = (setting: { handle: string; shapes?: StoneShape[] }): StoneShape[] => setting.shapes ?? SETTING_SHAPE_ORDER;
export const settingTakes = (setting: { handle: string; shapes?: StoneShape[] }, shape: string) => settingShapes(setting).some((item) => item === shape);

/** "Vine Engagement Ring Setting": the setting's name without its metal, as the list cards show it. */
export const settingTitle = (product: Pick<Product, "titleTemplate">) =>
  product.titleTemplate.replace(/\s+in\s+\{metal\}/i, "").replace("{metal}", "").replace("{carat}", "").replace(/\s+/g, " ").trim();

/** "Vine 14K White Gold": the short name in the step bar, as Figma's "Petite Pavé 14k White Gold". */
export const settingShortName = (product: Pick<Product, "titleTemplate">, metal: MetalId) =>
  `${settingTitle(product).replace(/\s*(Engagement Ring Setting|Ring Setting|Ring)$/i, "")} ${metalById(metal).label}`;

/** The setting's variant for a metal (its default when the metal isn't offered). */
export const settingVariant = (product: Product, metal: MetalId | null) => product.variants.find((variant) => variant.metal === metal) ?? product.variants[0];

/** "Vine": the setting's name without "Engagement Ring Setting", as Step 3's setting row shows it (Figma's "Petite Pavé"). */
export const settingShort = (product: Pick<Product, "titleTemplate">) => settingTitle(product).replace(/\s*(Engagement Ring Setting|Ring Setting|Ring)$/i, "");

/** "Vine" from a setting's Shopify title ("Vine Engagement Ring Setting in 14K White Gold"), for bag lines. */
export const settingShortFromTitle = (title: string) =>
  title
    .replace(/\s+in\s+.+$/i, "")
    .replace(/\s*(Engagement Ring Setting|Ring Setting|Ring)$/i, "")
    .trim();

/** "0.50 Carat I VVS2 Round Natural Diamond": the stone's title with "ct" written out, as Step 3 writes it. */
export const stoneCaratTitle = (title: string) => title.replace(/^(\d+(?:\.\d+)?)ct\b/, "$1 Carat");

type StoneFacts = { title: string; kind: StoneKind; origin: StoneOrigin; shape: string; carat: number; color: string; clarity: string; gem?: string };

const gemLabel = (stone: Pick<StoneFacts, "gem">) => GEM_TYPES.find((type) => type.value === stone.gem)?.label ?? "Gemstone";
const colorLabel = (stone: Pick<StoneFacts, "kind" | "color">) => (stone.kind === "diamond" ? stone.color : (GEM_COLORS.find((item) => item.value === stone.color)?.label ?? stone.color));

/**
 * The built ring's name, in each place's own wording (each frame words it differently):
 * - "desktop": Step 3's heading, "Vine 0.50 Carat I VVS2 Round Natural Diamond Engagement Ring" (Figma 6579:194422)
 * - "mobile": Step 3's heading, "The Vine with a 0.50 Carat I VVS2 Round Natural Diamond" (6579:208211)
 * - "bag": the bag page's heading, "Vine Ring with a 0.50 Carat I VVS2 Round Natural Diamond" (6579:196270)
 * - "panel": the bag panel's name, "Vine Ring" (5011:77722: "Hidden Halo Diamond Ring")
 */
export function ringName(settingName: string, stone: Pick<StoneFacts, "title">, form: "desktop" | "mobile" | "bag" | "panel") {
  const stoneName = stoneCaratTitle(stone.title);
  if (form === "desktop") return `${settingName} ${stoneName} Engagement Ring`;
  if (form === "mobile") return `The ${settingName} with a ${stoneName}`;
  if (form === "bag") return `${settingName} Ring with a ${stoneName}`;
  return `${settingName} Ring`;
}

/**
 * The stone's short name: Step 3's mobile row "Round Natural Diamond" (6579:208215), or the bag's "Natural Round
 * Diamond" / "Lab Pear Diamond" (6579:196303). Gemstones use their title without the weight.
 */
export function stoneShortName(stone: StoneFacts, form: "complete" | "bag") {
  if (stone.kind !== "diamond") return stone.title.replace(/^\S+ct\s+/, "");
  const shape = shapeLabel(stone.shape);
  return form === "complete" ? `${shape} ${stone.origin === "natural" ? "Natural" : "Lab-Grown"} Diamond` : `${stone.origin === "natural" ? "Natural" : "Lab"} ${shape} Diamond`;
}

/** "0.50ct • I • VVS2" (desktop row) or "0.50ct I VVS2" (mobile row). Gemstones: weight, colour and clarity code. */
export function stoneSummary(stone: StoneFacts, separator: " • " | " ") {
  return [`${stone.carat.toFixed(2)}ct`, colorLabel(stone), stone.clarity].filter(Boolean).join(separator);
}

/** The step bar's stone line on Step 3: "Round 0.50 Carat" (Figma "Round 0.50 Carat - $1,040", price shown once). */
export const stoneStepName = (stone: Pick<StoneFacts, "shape" | "carat">) => `${shapeLabel(stone.shape)} ${stone.carat.toFixed(2)} Carat`;
export { gemLabel, colorLabel as stoneColorLabel };
