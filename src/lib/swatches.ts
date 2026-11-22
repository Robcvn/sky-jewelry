/**
 * Metal swatches, one per distinct photo (Task 26, on trial; GROUP_SWATCHES_BY_PHOTO in features.ts turns it off).
 * Used by MetalSwatches (ProductCard.tsx): the product cards, search cards, quick views and the setting page's card.
 * A plain module, so scripts can check the counts.
 */
import type { MetalId } from "@/content/metals";
import { imagesFor, type Product, type ProductVariant } from "@/content/products";
import { GROUP_SWATCHES_BY_PHOTO } from "./features";

/**
 * Main photos that show the piece worn rather than in the studio. A card opened without a Metal filter starts on the
 * product's first metal with a studio photo (openingVariant), and a lifestyle photo's metal gets a swatch only when
 * the Metal filter chose it (swatchMetals).
 */
export const LIFESTYLE_PHOTOS: readonly string[] = ["product-ring-round-solitaire-yellow-gold"];

const isLifestyle = (product: Product, metal: MetalId) => LIFESTYLE_PHOTOS.includes(imagesFor(product, metal)[0]?.desktop ?? "");

/**
 * The variant a card opens on from a list of candidates (variant order): the first whose metal has a studio photo,
 * else the first. With GROUP_SWATCHES_BY_PHOTO off: the first. Lists without a Metal filter use this.
 */
export function preferStudio(product: Product, candidates: ProductVariant[]): ProductVariant | undefined {
  if (!GROUP_SWATCHES_BY_PHOTO) return candidates[0];
  return candidates.find((variant) => !isLifestyle(product, variant.metal)) ?? candidates[0];
}

/** The variant a card opens on with no filters: the product's first metal with a studio photo. */
export const openingVariant = (product: Product): ProductVariant => preferStudio(product, product.variants) ?? product.variants[0];

/**
 * The metals to offer as swatches, in variant order. With GROUP_SWATCHES_BY_PHOTO off: every metal. On: one per main
 * photo (imagesFor(product, metal)[0]), standing for the current metal when it is in the group, else the group's first;
 * a lifestyle photo is left out when another group has a studio photo, unless the Metal filter opened the card on one
 * of its metals (filterChose: that metal, or null).
 */
export function swatchMetals(product: Product, current: MetalId, filterChose: MetalId | null): MetalId[] {
  const metals = [...new Set(product.variants.map((item) => item.metal))];
  if (!GROUP_SWATCHES_BY_PHOTO) return metals;
  const groups = new Map<string, MetalId[]>();
  for (const metal of metals) {
    const photo = imagesFor(product, metal)[0]?.desktop ?? metal;
    groups.set(photo, [...(groups.get(photo) ?? []), metal]);
  }
  const studio = [...groups.keys()].some((photo) => !LIFESTYLE_PHOTOS.includes(photo));
  return [...groups]
    .filter(([photo, group]) => !(studio && LIFESTYLE_PHOTOS.includes(photo)) || (filterChose !== null && group.includes(filterChose)))
    .map(([, group]) => (group.includes(current) ? current : group[0]));
}
