/*
 * Where the shop links lead. The site has no separate Engagement Rings, Diamonds, Gemstones or Wedding Bands list pages,
 * so the menus and landing pages link to the lists that exist, with each filter in the address as that list reads it:
 * the ring builder's settings list (src/components/builder/settingFilters.ts), the stone-first stone list
 * (stoneFilters.ts) and the Fine Jewelry lists (src/components/plp/filters.ts). Inferred destinations (Deviations).
 */
import type { IconName } from "@/icons/icon-data";
import type { FineJewelryCategory } from "./products";

const withParams = (path: string, params: Record<string, string | undefined>) => {
  const query = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1]))).toString();
  return query ? `${path}?${query}` : path;
};

/** Ring builder Step 1, the settings list: a style, a centre stone shape ("Set with") or a metal family. */
export const settingsList = (params: { style?: string; shape?: string; metal?: string } = {}) => withParams("/design-your-own/", params);

/** Stone-first Step 1, the stone list in diamond mode (natural first, as drawn): an origin or a shape. */
export const diamondList = (params: { origin?: "natural" | "lab-grown"; shape?: string } = {}) => withParams("/design-your-own/stone/", { first: "stone", ...params });

/**
 * The same list in gemstone mode. `start` picks the gem where the list starts with one (sapphire, emerald, moissanite);
 * `gem` chooses a type it lists (ruby), `gemcolor` a colour, `shape` a shape.
 */
export const gemstoneList = ({ start = "gemstone", ...params }: { start?: "gemstone" | "sapphire" | "emerald" | "moissanite"; gem?: string; gemcolor?: string; shape?: string } = {}) =>
  withParams("/design-your-own/stone/", { start, first: "stone", ...params });

/** A Fine Jewelry list (one category, or all of them) with a type (style tag) or a metal family. */
export const fineJewelryList = (category: FineJewelryCategory | null, params: { type?: string; metal?: string } = {}) =>
  withParams(category ? `/fine-jewelry/${category}/` : "/fine-jewelry/shop/", params);

/**
 * The support page stands in for Contact and Locations. Its Contact section is mobile only: the mobile-only Contact links
 * (the mobile menu, the announcement bar's message icon) open it; links shown at both sizes open the page.
 */
export const SUPPORT = "/the-sky-guarantee/";
export const CONTACT = "/the-sky-guarantee/#contact";

/**
 * The Diamonds menu's and landing page's Diamond Jewelry links: each its category's diamond list. No product is an
 * eternity or anniversary ring; the rings list reads any type, so those two show its empty state.
 */
export const DIAMOND_JEWELRY: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "Eternity Rings", href: fineJewelryList("rings", { type: "eternity" }), icon: "eternity-ring" },
  { label: "Anniversary Rings", href: fineJewelryList("rings", { type: "anniversary" }), icon: "band-anniversary" },
  { label: "Diamond Studs", href: fineJewelryList("earrings", { type: "diamond" }), icon: "diamond-stud" },
  { label: "Diamond Pendants", href: fineJewelryList("necklaces", { type: "diamond" }), icon: "pendant-solitaire" },
  { label: "Tennis Bracelets", href: fineJewelryList("bracelets", { type: "diamond" }), icon: "tennis-bracelet" },
];
