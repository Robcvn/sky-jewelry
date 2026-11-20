import type { ImageRef } from "@/components/ui/Picture";
import { caratLabel, type DiamondType } from "@/content/catalog-seed";
import { metalById, parseMetal, type MetalId } from "@/content/metals";
import { productImageManifest } from "@/content/product-image-manifest";
import type { Product, ProductVariant } from "@/content/products";
import type { ShopifyProduct } from "./types";

export const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * The file name of a Shopify image without its extension, query and the "_<uuid>" Shopify adds when the same
 * file is imported twice: ".../ring-vine-white-gold_b129...jpg?v=1" -> "ring-vine-white-gold".
 */
export function imageStem(url: string) {
  const file = url.split("?")[0].split("/").pop() ?? "";
  return file.replace(/\.[a-z0-9]+$/i, "").replace(/_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "");
}

/** The Home best-seller crops, kept for the engagement rings imported in Task 8. */
const HOME_CROPS: Record<string, Omit<ImageRef, "alt">> = {
  "ring-white-gold": { desktop: "ring-white-gold-d", mobile: "ring-white-gold-m" },
  "ring-rose-gold": { desktop: "ring-rose-gold-d", mobile: "ring-rose-gold-m" },
};

/**
 * The site's own optimised WebP for a Shopify image, matched by file name (the Picture component serves
 * pre-sized local files; Shopify's CDN URL is not used for display). Unknown images are skipped.
 */
export function localImage(url: string, alt: string): ImageRef | null {
  const stem = imageStem(url);
  if (HOME_CROPS[stem]) return { ...HOME_CROPS[stem], alt };
  const key = `product-${stem}`;
  return key in productImageManifest ? { desktop: key as keyof typeof productImageManifest, alt } : null;
}

/** The tag every loose stone carries (shopify/builder-import.csv). */
export const LOOSE_STONE_TAG = "loose-stone";

/** 360° frames: images whose file name ends in "-spin-<number>", in number order. */
const SPIN = /-spin-(\d+)$/;

export const tagValue = (tags: string[], prefix: string) => tags.find((tag) => tag.startsWith(`${prefix}:`))?.slice(prefix.length + 1) ?? null;

export function metalOf(options: Array<{ name: string; value: string }>, tags: string[]): MetalId {
  const option = options.find((selected) => selected.name.toLowerCase() === "metal")?.value;
  return parseMetal(option) ?? tags.map(parseMetal).find(Boolean) ?? "14k-white-gold";
}

export function caratOf(options: Array<{ name: string; value: string }>) {
  const value = options.find((selected) => selected.name.toLowerCase() === "carat weight")?.value;
  const carat = value ? Number.parseFloat(value) : Number.NaN;
  return Number.isFinite(carat) ? carat : null;
}

/**
 * Maps a Storefront API product to the Product type the components use. The mock catalogue goes through this
 * same function (src/lib/mockCatalog.ts), so the site looks the same before and after the import.
 * - Variants: metal and carat from the "Metal" and "Carat Weight" options, in Shopify's order (default first).
 * - Photos: each metal's variant image, plus the product images that share its file name as a prefix
 *   (extra views such as "-angled"), in position order.
 * - Filters: tags style:, diamond:, shape:, length: and ships-in:. "Best Match" order: the number in the SKU.
 */
export function mapShopifyProduct(product: ShopifyProduct): Product | null {
  if (!product.handle || !product.title) return null;
  // Loose stones are the ring builder's (src/lib/builder.ts), not jewellery products.
  if (product.tags.includes(LOOSE_STONE_TAG)) return null;

  const variants: ProductVariant[] = product.variants.nodes
    .map((variant) => ({
      id: variant.id || null,
      metal: metalOf(variant.selectedOptions, product.tags),
      carat: caratOf(variant.selectedOptions),
      price: Number(variant.price.amount),
      available: variant.availableForSale,
      sku: variant.sku || null,
    }))
    .filter((variant) => Number.isFinite(variant.price));
  if (!variants.length) return null;

  const images: Partial<Record<MetalId, ImageRef[]>> = {};
  for (const metal of [...new Set(variants.map((variant) => variant.metal))]) {
    const index = product.variants.nodes.findIndex((_, i) => variants[i]?.metal === metal);
    const mainUrl = product.variants.nodes[index]?.image?.url ?? product.featuredImage?.url;
    if (!mainUrl) continue;
    const main = imageStem(mainUrl);
    const views = product.images.nodes.filter((image) => {
      const stem = imageStem(image.url);
      return !SPIN.test(stem) && (stem === main || stem.startsWith(`${main}-`));
    });
    const refs = (views.length ? views : [{ url: mainUrl, altText: null }])
      .map((image) => localImage(image.url, image.altText || product.title))
      .filter((image): image is ImageRef => image !== null);
    if (refs.length) images[metal] = refs;
  }

  const first = variants[0];
  const image = images[first.metal]?.[0] ?? Object.values(images)[0]?.[0];
  if (!image) return null;

  const metalLabel = metalById(first.metal).label;
  const titleTemplate = product.title
    .replace(metalLabel, "{metal}")
    .replace(first.carat === null ? "\u0000" : caratLabel(first.carat), "{carat}");

  const shipsIn = Number(tagValue(product.tags, "ships-in"));
  const rank = Number(product.variants.nodes[0]?.sku?.match(/^SKY-[A-Z](\d+)-/)?.[1] ?? 0);

  return {
    _id: product.handle,
    _type: "product",
    name: product.title,
    slug: product.handle,
    category: slugify(product.productType) || "products",
    description: product.description,
    priceFrom: Math.min(...variants.map((variant) => variant.price)),
    metal: first.metal,
    image,
    titleTemplate,
    variants,
    images,
    styles: product.tags.filter((tag) => tag.startsWith("style:")).map((tag) => tag.slice(6)),
    diamondType: tagValue(product.tags, "diamond") as DiamondType | null,
    shape: tagValue(product.tags, "shape"),
    length: tagValue(product.tags, "length"),
    shipsInDays: Number.isFinite(shipsIn) && shipsIn > 0 ? shipsIn : null,
    rank,
    tags: product.tags,
    spin: spinFrames(product),
  };
}

function spinFrames(product: ShopifyProduct): ImageRef[] | null {
  const frames = product.images.nodes
    .map((image) => ({ image, frame: Number(imageStem(image.url).match(SPIN)?.[1]) }))
    .filter(({ frame }) => Number.isFinite(frame))
    .sort((a, b) => a.frame - b.frame)
    .map(({ image }) => localImage(image.url, image.altText || product.title))
    .filter((image): image is ImageRef => image !== null);
  return frames.length > 1 ? frames : null;
}
