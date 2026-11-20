/*
 * The product type the components use, and helpers for it.
 * Products come from Shopify at build time (src/lib/catalog.ts). When Shopify is unavailable, the build uses
 * the mock catalogue made from src/content/catalog-seed.ts, run through the same mapper, so both look identical.
 */
import type { ImageRef } from "@/components/ui/Picture";
import type { DiamondType } from "./catalog-seed";
import { caratLabel, fillTitle } from "./catalog-seed";
import { metalById, type MetalId } from "./metals";

export type { MetalId } from "./metals";

export type ProductVariant = {
  /** Shopify variant id (gid://shopify/ProductVariant/...), or null in the mock catalogue. */
  id: string | null;
  metal: MetalId;
  carat: number | null;
  price: number;
  available: boolean;
  sku: string | null;
};

export type Product = {
  _id: string;
  _type: "product";
  /** Title of the default variant, e.g. "14K Yellow Gold Four Prong Solitaire 0.80ct Lab-Grown Pendant". */
  name: string;
  slug: string;
  /** URL segment of the product's category, from Shopify's product type (e.g. "necklaces"). */
  category: string;
  description: string;
  /** Lowest price in USD, shown as "starting at". */
  priceFrom: number;
  /** Metal of the default variant. */
  metal: MetalId;
  /** Main photo of the default variant. */
  image: ImageRef;
  /** The title with {metal} and {carat} placeholders, so each variant gets its own name. */
  titleTemplate: string;
  /** Default variant first. */
  variants: ProductVariant[];
  /** Photos for each metal the product comes in, main photo first. */
  images: Partial<Record<MetalId, ImageRef[]>>;
  /** Fine Jewelry sub-types (diamond, gemstone, gold, stackable, cocktail...). */
  styles: string[];
  diamondType: DiamondType | null;
  shape: string | null;
  /** Chain or bracelet length in inches, e.g. "16-18". */
  length: string | null;
  shipsInDays: number | null;
  /** "Best Match" order within the category. */
  rank: number;
  /** The Shopify tags, for attributes only some pages read (the ring builder's setting specs). */
  tags: string[];
  /**
   * 360° image sequence (Shopify images named "<photo>-spin-01", "-spin-02", ...), or null.
   * No product has one yet: the 360° view is hidden until a sequence is added.
   */
  spin: ImageRef[] | null;
};

export const FINE_JEWELRY_CATEGORIES = ["rings", "necklaces", "earrings", "bracelets"] as const;
export type FineJewelryCategory = (typeof FINE_JEWELRY_CATEGORIES)[number];

export const isFineJewelry = (category: string): category is FineJewelryCategory =>
  (FINE_JEWELRY_CATEGORIES as readonly string[]).includes(category);

/**
 * Product detail route. Fine Jewelry products live under /fine-jewelry/<category>/. Engagement rings are ring
 * settings: their page is the ring builder's setting page.
 */
export const productHref = (product: Pick<Product, "category" | "slug">) =>
  isFineJewelry(product.category)
    ? `/fine-jewelry/${product.category}/${product.slug}/`
    : product.category === "engagement-rings"
      ? `/design-your-own/setting/${product.slug}/`
      : `/${product.category}/${product.slug}/`;

export const formatPrice = (usd: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(usd);

/** "$1,250.00": the bag and the account pages show cents, as Figma does. */
export const formatMoney = (usd: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(usd);

/** Monthly amount for the "Pay in 12 interest-free installments" line: cents only when it doesn't divide evenly. */
export function formatInstallment(usd: number, months = 12) {
  const monthly = Math.ceil((usd / months) * 100) / 100;
  const whole = Number.isInteger(monthly);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(monthly);
}

export const formatCarat = (carat: number) => carat.toFixed(2);

/** The variant's own title, e.g. switching the metal swatch turns "14K Yellow Gold ..." into "14K White Gold ...". */
export const variantName = (product: Product, variant: ProductVariant) =>
  fillTitle(product.titleTemplate, metalById(variant.metal).label, variant.carat === null ? null : caratLabel(variant.carat));

/** Photos for a metal, falling back to the default photo. */
export const imagesFor = (product: Product, metal: MetalId) => product.images[metal] ?? [product.image];
