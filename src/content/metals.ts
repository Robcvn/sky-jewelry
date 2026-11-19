/*
 * Metals, from the Figma Filters sheet (Metal tiles) and the Product Card swatches.
 * Swatch colours are Figma's swatch fills. 14K and 18K of the same colour share a swatch; the badge
 * on the filter tile (14K / 18K / PT) is what tells them apart.
 */
export type MetalId =
  | "14k-white-gold"
  | "14k-yellow-gold"
  | "14k-rose-gold"
  | "18k-white-gold"
  | "18k-yellow-gold"
  | "18k-rose-gold"
  | "platinum";

/** The colour family, used by the menu links (?metal=yellow-gold matches 14K and 18K yellow gold). */
export type MetalFamily = "white-gold" | "yellow-gold" | "rose-gold" | "platinum";

export type MetalInfo = {
  id: MetalId;
  /** Shopify option value and card label, e.g. "14K Yellow Gold". */
  label: string;
  /** Filter tile label under the badge, e.g. "Yellow Gold". */
  shortLabel: string;
  /** Badge text on the filter tile. */
  badge: "14K" | "18K" | "PT";
  family: MetalFamily;
  swatch: string;
};

const SWATCH: Record<MetalFamily, string> = {
  "white-gold": "#e3e5cb",
  "yellow-gold": "#e0d06b",
  "rose-gold": "#fdb2a1",
  platinum: "#e5e7eb",
};

const gold = (karat: "14K" | "18K", colour: "White" | "Yellow" | "Rose"): MetalInfo => {
  const family = `${colour.toLowerCase()}-gold` as MetalFamily;
  return {
    id: `${karat.toLowerCase()}-${family}` as MetalId,
    label: `${karat} ${colour} Gold`,
    shortLabel: `${colour} Gold`,
    badge: karat,
    family,
    swatch: SWATCH[family],
  };
};

/** In Figma's tile order. */
export const METALS: MetalInfo[] = [
  gold("14K", "White"),
  gold("14K", "Yellow"),
  gold("14K", "Rose"),
  gold("18K", "White"),
  gold("18K", "Yellow"),
  gold("18K", "Rose"),
  { id: "platinum", label: "Platinum", shortLabel: "Platinum", badge: "PT", family: "platinum", swatch: SWATCH.platinum },
];

export const metalById = (id: MetalId) => METALS.find((metal) => metal.id === id)!;

/** Shopify option value ("14K Yellow Gold") or a slug ("14k-yellow-gold") to a metal id. */
export function parseMetal(value: string | undefined | null): MetalId | null {
  if (!value) return null;
  const slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  // Older imports used the colour alone ("Rose Gold"): read it as 14K.
  return METALS.find((metal) => metal.id === slug || metal.id === `14k-${slug}`)?.id ?? null;
}

/** Metal ids for a URL value: an exact id, or a colour family from the menu links. */
export function metalsForParam(value: string): MetalId[] {
  const exact = METALS.find((metal) => metal.id === value);
  if (exact) return [exact.id];
  return METALS.filter((metal) => metal.family === value).map((metal) => metal.id);
}
