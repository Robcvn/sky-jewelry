/*
 * The product type the components use, and the mock catalogue.
 * Products now come from Shopify at build time (src/lib/catalog.ts). This mock list is the fallback used
 * only when Shopify can't be reached or returns nothing. It is also the source of shopify/products-seed.csv.
 * Names, prices and photos are from the Figma Home frames.
 */
import type { ImageRef } from "@/components/ui/Picture";

export type Metal = "white-gold" | "yellow-gold" | "rose-gold";

export type Product = {
  _id: string;
  _type: "product";
  name: string;
  slug: string;
  /** URL segment of the product's category, from Shopify's product type (e.g. "engagement-rings"). */
  category: string;
  description: string;
  /** Lowest price in USD, shown as "starting at". */
  priceFrom: number;
  metal: Metal;
  image: ImageRef;
};

export const whiteGold = (alt: string): ImageRef => ({ desktop: "ring-white-gold-d", mobile: "ring-white-gold-m", alt });
export const roseGold = (alt: string): ImageRef => ({ desktop: "ring-rose-gold-d", mobile: "ring-rose-gold-m", alt });

export const mockProducts: Product[] = [
  {
    _id: "channel-set-ring",
    _type: "product",
    name: "Channel Set Ring",
    slug: "channel-set-ring",
    category: "engagement-rings",
    description: "Diamonds set flush along the band.",
    priceFrom: 999,
    metal: "white-gold",
    image: whiteGold("Channel Set Ring in white gold with a round diamond"),
  },
  {
    _id: "halo-ring",
    _type: "product",
    name: "Halo Ring",
    slug: "halo-ring",
    category: "engagement-rings",
    description: "A circle of diamonds frames the stone.",
    priceFrom: 999,
    metal: "rose-gold",
    image: roseGold("Halo Ring in rose gold with a round diamond"),
  },
  {
    _id: "side-stone-ring",
    _type: "product",
    name: "Side-Stone Ring",
    slug: "side-stone-ring",
    category: "engagement-rings",
    description: "Accent stones beside the center stone.",
    priceFrom: 999,
    metal: "white-gold",
    image: whiteGold("Side-Stone Ring in white gold with a round diamond"),
  },
  {
    _id: "eternity-ring",
    _type: "product",
    name: "Eternity Ring",
    slug: "eternity-ring",
    category: "engagement-rings",
    description: "Diamonds set all the way around.",
    priceFrom: 999,
    metal: "rose-gold",
    image: roseGold("Eternity Ring in rose gold with a round diamond"),
  },
];

export const productHref = (product: Product) => `/${product.category}/${product.slug}/`;

export const formatPrice = (usd: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(usd);
